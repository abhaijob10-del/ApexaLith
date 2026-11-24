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

## Catalogue and media checkpoint

Authentication committed and pushed as 52ee90c. Added listing, enquiry, saved-property, settings and dashboard APIs; validated image decoding and WebP variants; configurable local/S3 storage; and transactional gallery references and audit events. The PostgreSQL HTTP suite passed for apartment/design creation, draft visibility, publication, search, save, four request types, internal notes, media retrieval, referenced deletion rejection, archival and unused-image deletion. S3 was not contacted.

## UI checkpoint

Catalogue phase committed and pushed as f4331a6. The active React entry now uses the persisted catalogue and server identity. The dashboard supports apartment/design publication, preview, gallery ordering, upload and archive, leads, customers and content. Existing specialist BIM/interior sources are preserved outside the active public entry. The original homepage photograph, brand typefaces and company identity were retained. Public pages include detail URLs, search, saved apartments, profile, requests, contact and draft legal text.

Headless Edge verified administrator CLI creation, sign-in, listing preview/publication, search, restart persistence, session persistence and reset-driven revocation. A real detail page fit 375, 768 and 1366 pixel viewports. Type checking and the production build passed. The main JavaScript bundle is about 244 kB before gzip, with the admin UI split out.

## Security, SEO and release verification

UI phase committed and pushed as 31b50fe. Added optional per-admin authenticator MFA with encrypted secrets and replay checks, disabled legacy APIs in production, added readiness and request-origin checks, production security headers, stable canonical URLs, server-rendered property metadata, sitemap and robots rules. Added opt-in development drafts and maintenance for expired authentication records and interrupted media operations. Updated vulnerable dependencies including the image decoder; the full npm audit returned zero known advisories.

Final local results: npm run lint and npm run build passed. On PostgreSQL 18 all three migrations applied and replayed. The HTTP workflow suite and the headless Edge production suite both passed. Tests include expired sessions, OTP attempt exhaustion, MFA replay, draft visibility, media reference protection, local uploaded image persistence across restart, responsive detail pages, CLI reset, sitemap, Open Graph metadata and private noindex. The test harness never used the owner's database. The final main bundle was about 76.7 kB gzip.

Remaining launch gates: configure the owner's local DATABASE_URL, provision the first real administrator, independently approve and test domestic SMS delivery, validate HTTPS/proxy and actual persistent storage, restore a backup, approve company/legal/RERA content and test accessibility and field performance on real devices. No public deployment, purchase, production migration or customer communication occurred. The operator confirmed that pushing production has no connected deployment. Next step is the owner configuration in SETUP_GUIDE.md followed by the staging checks in DEPLOYMENT_GUIDE.md.

## Release tests

Hardening commit 6a92144 is on origin/production. Extended QA verified replacement and reordering of gallery images, the maintenance command, refusal to seed production, and idempotent creation of two development-only drafts. Test storage is explicitly local and fresh harness runs clean up their own stopped temporary cluster.
