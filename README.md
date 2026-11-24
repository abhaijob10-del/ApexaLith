# ApexaLith

Bengaluru property and construction-design catalogue with a customer account area and a separate administrative dashboard.

## Run locally

Use Node.js 24, npm and PostgreSQL. In the repository root, configure a dedicated development database and private variables using [SETUP_GUIDE.md](SETUP_GUIDE.md). Then run:

```powershell
npm.cmd ci
npm.cmd run db:migrate
npm.cmd run dev
```

Open http://127.0.0.1:3000. The admin login is at http://127.0.0.1:3000/admin/login. First administrator creation and reset use the local [admin CLI](ADMIN_GUIDE.md).

## Architecture

- React, TypeScript, Tailwind and Vite power the public pages and lazy-loaded dashboard. The entry point is src/App.tsx. Shared catalogue components live in src/catalog.
- Express serves the site and same-origin JSON endpoints under /api/v1. Authentication, validation, catalogue operations, media, storage and SEO are in backend. Customer and administrator privileges are checked on the server.
- PostgreSQL is the source of truth for the production site. The pg pool uses the apexalith schema. Numbered SQL migrations and a transaction-locked migration ledger live in db. Existing BIM/interior/Firebase prototype sources remain in the repository. Legacy mock business APIs are unavailable in production.
- Listings share a discriminator for apartments and designs. Publication is independent of availability. Ordered gallery references and floor plans link to media. Enquiries cover contact, site visits, property questions and non-binding booking requests. Sessions store token digests. Audit entries record administrator activity.
- Sharp generates WebP variants. Storage uses a persistent local directory or a private S3-compatible bucket. Database references prevent deleting media that still belongs to a listing or content setting.

## Quality and operations

```powershell
npm.cmd run lint
npm.cmd run build
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/test-postgres.ps1
npm.cmd audit
```

The test harness creates its own PostgreSQL cluster on loopback and runs HTTP and headless Edge tests. Build first. Use -Bin to override the PostgreSQL binary directory, and QA_BROWSER_CHANNEL=chrome if using installed Chrome. Run the script in a separate PowerShell process as shown.

See [project status](PROJECT_STATUS.md), [local setup](SETUP_GUIDE.md), [admin operations](ADMIN_GUIDE.md) and [deployment](DEPLOYMENT_GUIDE.md) for verification results and outstanding launch approvals.
