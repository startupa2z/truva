# Analytics and comments

See [README.md](README.md) for production storage, access, retention, testing and rollback.

Local state is ignored by Git under `.local/`; production state belongs in the Truva-only `/data` volume. Local and production counts are separate. Public article counts use `/api/views`; private page and visitor totals and moderation use `/admin/community` with an owner-held admin key. The API enforces same-origin JSON writes, rate limits, input limits and approval before comments appear publicly.
