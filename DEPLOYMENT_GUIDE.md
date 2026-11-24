# Deployment and approval

## Release package

1. Build from a reviewed production-branch commit with Node 24 and npm. Run npm ci, npm run lint, npm run build and the isolated tests in README.md. Only the npm lockfile was used for this upgrade.
2. Package dist/server.mjs, dist/public, package.json, package-lock.json, db, backend and scripts. Install runtime dependencies for the target OS/CPU using npm ci --omit=dev. Sharp needs its platform-specific optional packages. Keep the web root limited to dist/public.
3. Provision a dedicated PostgreSQL database and owner/migration role. Use a separate limited runtime role in production. Give it schema usage, table DML and sequence access in apexalith for the application tables. Restrict owner, DDL and migration-ledger writes to the migration identity. Back up the database and verify a restore in isolation.
4. Set DATABASE_URL privately for the migration role. Execute npm run db:migrate once per release. Migrations take a transaction-scoped advisory lock and reject changed applied SQL files. Switch to the runtime connection string for the web process. Require verified TLS for remote database connections and install the provider CA where required. Avoid insecure certificate overrides.
5. Configure NODE_ENV=production, APP_ORIGIN to the exact public HTTPS origin, HOST, PORT, OTP_SECRET, MFA_ENCRYPTION_KEY and the SMS variables described in SETUP_GUIDE.md. Bind loopback behind a local reverse proxy, or a private container interface required by the host. Only set TRUSTED_PROXY to the actual trusted proxy IP/subnet when it overwrites forwarded headers. Proxy HTTPS, cap request sizes, and rate-limit by actual client address.
6. Create the first administrator with ADMIN_GUIDE.md. Run npm start in the release directory with a process supervisor. Confirm /readyz returns HTTP 200, /api/health responds and unauthenticated /api/v1/manage/overview returns 401. Verify secure cookies in the real HTTPS environment.
7. Schedule npm run maintenance at least hourly from the release directory. It clears expired authentication records and retries queued storage cleanup. Monitor structured stderr/stdout events, HTTP errors and repeated sign-in failures. Keep request bodies, query values, cookies and credentials out of proxy logs.

Hosting, SMS, managed PostgreSQL, backups and object storage can incur charges. Local QA can continue before any of these are purchased.

## Media storage

**S3-compatible object storage** requires a private bucket created in the approved region. Set MEDIA_STORAGE=s3, S3_BUCKET and S3_REGION. For a compatible provider also set its HTTPS S3_ENDPOINT. On AWS assign the workload an IAM role with GetObject, PutObject and DeleteObject scoped to that bucket's object keys. For compatible storage without workload identity, configure AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY privately. Maintain backups/versioning appropriate for the company's retention rules. Use the same bucket and region across restarts and replicas.

**Persistent local storage** requires MEDIA_STORAGE=local and an absolute MEDIA_DIR on a mounted, backed-up persistent volume. Set read/write permissions for the service identity only. All replicas must see the same files. A temporary deployment directory is unsuitable. The same storage configuration must reach the maintenance command.

To verify, upload a company-approved test image into a draft listing, preview it as admin, confirm it is private as a guest, publish the approved test listing in staging and check both responsive variants. Restart the web process and retrieve the same image. Remove references, delete the test image and verify storage cleanup. Local filesystem delivery passed automated tests. Actual bucket permissions, delivery and billing need account-owner verification.

## Company approval before launch

- Verify Bengaluru company identity, contact channels, prices, availability, measurements, floor plans and applicable Karnataka RERA registration/advertising details for each listing. Confirm rights for every image, promotional claim and testimonial. Replace the illustrative homepage photo.
- Obtain approval for the privacy notice and terms, collection purposes, applicable consent, retention periods, deletion/access handling and grievance contact. The current legal pages are placeholders. Verify the current Indian data-protection obligations with the company's advisor.
- Retire the former demo administrator password everywhere it may have been reused. It remains in original Git history. Keep production secrets in a protected store. Database availability, SMS provider settings, deployment topology, recovery procedures, storage restore, field Core Web Vitals and full accessibility acceptance require the operator's environment.
- Verify the production SMS route using the separately authorized handset test. Monitor delivery and provider spend. No deployment or live communication was performed by this upgrade.

For rollback, retain the previous production-branch build and an independently verified backup. Check schema compatibility before starting an earlier binary. Restore backups into a separate database for validation before considering any cutover. Changes to main, public deployment and production data require separate approval.
