# First party analytics

See [README.md](README.md) for production storage, access, retention, testing and rollback.

Local and production counts are separate. FastAPI provides `/api/views` and the private `/admin/community` dashboard. PostgreSQL stores page and visitor totals. The API enforces same-origin JSON writes, rate limits, input limits, and an owner-held admin key.
