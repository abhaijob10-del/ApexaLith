# ApexaLith production upgrade

## Verified baseline

On 24 November 2026 the clean production checkout and both live GitHub branches pointed to f3592dc. No previous implementation checkpoint, stash, second worktree or status document was available. The adjacent source archive also lacked a status document.

React 19, Vite, TypeScript, Tailwind and Express are retained. The entry point uses the existing components directory. Additional BIM, Firebase and interior design modules exist and have been preserved. The active Express routes store records in process memory. Browser content includes demonstration listings and business claims. Existing authentication includes a committed administrator credential, passwordless role fallbacks and client-controlled identity. Treat the original application and its history as sensitive. Private environment files are ignored. The only tracked dotenv file is the example.

## Verified changes

The production bundle now builds as ESM, serves only dist/public and defaults to loopback. PORT and HOST are configurable. Type checking, the production build and a local HTTP smoke test passed. The test checked the health response, homepage and that server bundle and map paths returned only the SPA document. The frontend build still warns about a 575 kB JavaScript chunk.

## Next work

1. Add additive PostgreSQL schema, migration runner and isolated migration verification. PostgreSQL 18 tools exist locally. The default endpoint did not respond to pg_isready, and the local dotenv file has no database connection variable.
2. Replace legacy role fallback and hardcoded login with verified server sessions, SMS OTP and administrator provisioning. Restrict all legacy administrative APIs.
3. Implement listing, design, media, enquiry and CMS management, then public browsing and customer workflows. Keep demos out of published content.
4. Verify security, responsive layouts, database persistence, production configuration and provider delivery. Finish operator guides.

Production deployment is blocked. The database, auth, CMS, media and customer workflows have not passed production acceptance. No SMS sent or production records changed.

## PostgreSQL checkpoint

Build repair committed as 2f890d3. Added pooled node-postgres connections, an isolated apexalith schema, additive transactions and checksum-verified migrations. The schema covers customers, administrators, sessions, OTP challenges, throttling, apartments/designs, ordered media references, saved properties, enquiries, content settings and audit history. In a separate disposable PostgreSQL 18 instance the initial migration, replay and ledger check passed. Existing databases were untouched. Application route integration follows.

## Authentication and authorization checkpoint

PostgreSQL phase committed as 3e5e6d0 and pushed to origin/production. Replaced the hardcoded administrator and fallback login API. Added scrypt administrator provisioning/reset, keyed OTP digests, development and Twilio delivery adapters, rate limits, expiring cookie sessions, profile edits and session revocation. Legacy business APIs require a database-backed administrator session. The original credential remains in Git history and must be retired wherever it was reused.

PostgreSQL HTTP tests passed for normalized phone login, cooldown, invalid/expired/replayed codes, profile edit, administrator login, forbidden customer access, logout and the production development-provider guard. Real SMS remains untested. Next are the dashboard, database-backed public catalogue, media and replacement of the legacy demo role switcher.
