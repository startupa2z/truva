"""Import a consistent production SQLite snapshot into an empty PostgreSQL analytics DB.

Defaults to inspection. --apply is required to write. The source is read-only.
"""
import argparse
import hashlib
import json
import os
from pathlib import Path
import sqlite3

import psycopg
from psycopg.types.json import Jsonb


def migrate(source: Path, database_url: str, apply: bool = False):
    checksum = hashlib.sha256(source.read_bytes()).hexdigest()
    with sqlite3.connect(source.resolve().as_uri() + "?mode=ro", uri=True) as old:
        old.execute("PRAGMA trusted_schema=OFF")
        if old.execute("PRAGMA integrity_check").fetchone()[0] != "ok":
            raise RuntimeError("Source snapshot failed integrity check")
        tables = {row[0] for row in old.execute("SELECT name FROM sqlite_master WHERE type='table'")}
        if not {"views", "visitors"}.issubset(tables):
            raise RuntimeError("Source is not a supported analytics database")
        views = old.execute("SELECT day,path,count FROM views").fetchall()
        visitors = old.execute("SELECT day,id FROM visitors").fetchall()
        comments = []
        if "comments" in tables:
            old.row_factory = sqlite3.Row
            comments = [dict(row) for row in old.execute("SELECT * FROM comments")]
    expected = {"viewRows": len(views), "totalViews": sum(row[2] for row in views),
                "visitorRows": len(visitors), "archivedComments": len(comments)}
    with psycopg.connect(database_url) as new:
        with new.transaction():
            new.execute("LOCK TABLE views, visitors IN ACCESS EXCLUSIVE MODE")
            occupied = new.execute("SELECT (SELECT COUNT(*) FROM views) + (SELECT COUNT(*) FROM visitors)").fetchone()[0]
            if occupied:
                raise RuntimeError("Destination contains analytics data; refusing to overwrite or merge")
            if not apply:
                return {"status": "dry-run", "sourceSha256": checksum, **expected}
            new.execute("CREATE TABLE IF NOT EXISTS legacy_sqlite_imports (source_sha256 text PRIMARY KEY, imported_at timestamptz NOT NULL DEFAULT now(), counts jsonb NOT NULL)")
            if new.execute("SELECT 1 FROM legacy_sqlite_imports WHERE source_sha256=%s", (checksum,)).fetchone():
                raise RuntimeError("This snapshot was already imported")
            new.execute("CREATE TABLE IF NOT EXISTS legacy_comments_archive (source_sha256 text NOT NULL REFERENCES legacy_sqlite_imports(source_sha256), legacy_id bigint NOT NULL, record jsonb NOT NULL, PRIMARY KEY(source_sha256,legacy_id))")
            new.execute("INSERT INTO legacy_sqlite_imports(source_sha256,counts) VALUES (%s,%s)", (checksum,Jsonb(expected)))
            with new.cursor() as cursor:
                cursor.executemany("INSERT INTO views(day,path,count) VALUES (%s,%s,%s)", views)
                cursor.executemany("INSERT INTO visitors(day,id) VALUES (%s,%s)", visitors)
                cursor.executemany("INSERT INTO legacy_comments_archive(source_sha256,legacy_id,record) VALUES (%s,%s,%s)", [(checksum,row["id"],Jsonb(row)) for row in comments])
            actual = new.execute("SELECT (SELECT COUNT(*) FROM views), (SELECT COALESCE(SUM(count),0) FROM views), (SELECT COUNT(*) FROM visitors), (SELECT COUNT(*) FROM legacy_comments_archive WHERE source_sha256=%s)", (checksum,)).fetchone()
            if tuple(expected.values()) != actual:
                raise RuntimeError("Migration count mismatch; transaction rolled back")
    return {"status": "imported", "sourceSha256": checksum, **expected}


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("source", type=Path)
    parser.add_argument("--apply", action="store_true")
    args = parser.parse_args()
    print(json.dumps(migrate(args.source, os.environ["DATABASE_URL"], args.apply)))
