CREATE TABLE IF NOT EXISTS views (
  day date NOT NULL,
  path text NOT NULL,
  count bigint NOT NULL DEFAULT 0,
  PRIMARY KEY (day, path)
);

CREATE TABLE IF NOT EXISTS view_events (
  id char(64) PRIMARY KEY,
  expires_at timestamptz NOT NULL
);

CREATE INDEX IF NOT EXISTS view_events_expiry ON view_events (expires_at);

CREATE TABLE IF NOT EXISTS visitors (
  day date NOT NULL,
  id char(64) NOT NULL,
  PRIMARY KEY (day, id)
);

CREATE INDEX IF NOT EXISTS visitors_day ON visitors (day);
