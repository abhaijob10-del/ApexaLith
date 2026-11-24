# Administration

## First account

Configure DATABASE_URL and apply migrations as described in SETUP_GUIDE.md. From the repository root in PowerShell, substitute your own administrator email:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/admin.ps1 create admin@example.com
```

Enter a unique password of 14 to 128 characters at the hidden local prompt. The script uses scrypt and records the provisioning event. Open http://127.0.0.1:3000/admin/login and sign in. The dashboard is /admin/dashboard. There is no public administrator registration. Provisioning is free and requires local database access.

## Password changes, recovery and MFA

Use Dashboard > Security to change a password or sign out. An operator with database access can recover an account locally:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/admin.ps1 reset admin@example.com
```

Changes revoke existing sessions. Reset preserves MFA. For optional authenticator-app MFA, store a cryptographically random 64-hex-character MFA_ENCRYPTION_KEY in the private environment of both the CLI and server. Back it up securely. Use a password manager to generate a random 32-character Base32 secret from A–Z and 2–7. Add it manually to the administrator's authenticator as time-based, SHA-1, six digits, 30 seconds. Invoke the following command and enter that same secret at its hidden prompt:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/admin.ps1 enable-mfa admin@example.com
```

Verify sign-in with the current authenticator code. After verifying the operator's identity, a database administrator can run the same command with disable-mfa for lost-device recovery, then enroll a replacement. These operations revoke sessions and leave an audit event. Protect the database account and host console as recovery credentials.

## Managing the site

- **Apartments / Designs** supports search, publication filters, sorting and pagination. Add or edit a listing, preview it and save. Use a stable lowercase URL slug. Draft and archived listings are private. A published apartment can be available, reserved or sold. Archive to retire a listing while keeping its enquiry history.
- **Gallery** accepts multiple JPEG, PNG or WebP images, up to 8 MB and 24 megapixels each. The first image is the cover. Move images earlier to reorder. To replace an image, upload the replacement, remove the old gallery reference and save. Use the floor-plan field for a separate image.
- **Media** stores optimized originals for display and smaller previews. Delete an unused image only after removing its listing, floor-plan and content references.
- **Enquiries** shows contact messages, property enquiries, site visits and booking requests. Filter by type/status or search by name, phone or listing. Open a row to update status or internal notes. Booking requests are non-binding and do not collect money. Confirm dates and availability separately.
- **Customers** shows names, join dates and masked phone numbers. Full callback details are restricted to the relevant enquiry view.
- **Content** controls hero photography and text, company and contact details, banner, testimonial and social profile. Use authorized images and approved copy. Feature an apartment or design using its listing editor. Publish testimonials only with documented permission.
