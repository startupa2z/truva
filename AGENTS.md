# Truva website workflow

- Canonical source repository: https://github.com/startupa2z/truva.
- This checkout is the local development and verification copy.
- Before changes, inspect Git status and refresh remote state. Preserve existing work.
- Develop and verify locally before pushing changes for production deployment.
- Before a production release, verify the actual Truva Coolify resource, configured branch, compose file, deployed commit, and rollback path.
- Production shares a VPS with StartupA2Z. Scope deployment commands to Truva; do not restart shared infrastructure or unrelated applications.
- Production database records are authoritative. Never replace them with local development data.
- Keep credentials outside Git. Use local environment files or the deployment secret store.
- After deployment, verify the deployed commit, homepage, health endpoint, and affected user flows.

## Single Truva website workspace
Security Hub is part of this website at `/security-hub`, not a separate product. Canonical local checkout: `/Users/satz/My Drive/3-focus/truva-site`. Continue all basic-page and Security Hub edits here. The former `truva-security-hub-local` worktree is retained only as a historical copy; do not develop there. Read `/Users/satz/myfiles/myproducts/hermes/context/truva/security-hub/handoff.md` for current context.
