# Local setup

## PostgreSQL on Windows

1. Open pgAdmin, expand Servers, and open the server's Properties > Connection. Read the host, port and maintenance database there. Use the username for a local role allowed to create a development database. If PostgreSQL is offline, open Services, locate the installed PostgreSQL service and start it. For a custom installation use its existing service procedure.
2. In the PostgreSQL SQL Shell (psql), connect to that local server and maintenance database. The installation password belongs in the local prompt. Stored PostgreSQL passwords cannot be read back in plaintext. Ask the database owner to provision a separate role if you lack access.
3. For a fresh development database, run the following once. If either name already exists, choose unused names. Keep existing databases intact.

```sql
CREATE ROLE apexalith_app LOGIN;
\password apexalith_app
CREATE DATABASE apexalith_dev OWNER apexalith_app;
```

4. Open the existing ignored .env.local in a local editor. Preserve its settings. Use .env.example as a list of keys. Set DATABASE_URL to postgresql://apexalith_app:YOUR_URL_ENCODED_PASSWORD@127.0.0.1:5432/apexalith_dev using the actual host, port, database and role. Percent-encode reserved URL characters in the password locally. Keep this value out of Git, screenshots, support messages and shell history.
5. Set NODE_ENV=development, HOST=127.0.0.1, PORT=3000, APP_ORIGIN=http://127.0.0.1:3000 and MEDIA_STORAGE=local. MEDIA_DIR defaults to var/media in the working directory. Choose an absolute directory if you need a different persistent location.
6. From the repository root run npm.cmd ci, npm.cmd run db:migrate and npm.cmd run dev. Open http://127.0.0.1:3000/readyz and confirm that ready is true. Running the migration again checks checksums and skips applied files. The production site never imports prototype records automatically.

Local setup uses free software. Development and automated QA can proceed without an SMS or cloud storage account. For optional draft examples run npm.cmd run db:seed with NODE_ENV=development and a database whose name ends in _dev. The seed leaves existing rows intact and never runs at startup.

## Development phone sign-in

In .env.local set OTP_PROVIDER=development, DEV_OTP to a private six-digit testing code and OTP_SECRET to at least 32 cryptographically random characters from a password manager. Restart npm.cmd run dev. Open /account, enter a test Indian mobile number and then the configured code. This local provider sends no messages. The built production entry disables it. Codes expire after five minutes, have five attempts, and require a minute between sends. Login sets an eight-hour HTTP-only session cookie.

## Production SMS

Use Twilio Programmable Messaging. Service and carrier usage are potentially paid. Configure the account only when the company authorizes it.

1. Choose the domestic India route with Twilio and confirm that the company and OTP use case are eligible. Follow the DLT operator and Twilio processes for entity, sender/header, telemarketer chain, template registration and allowlisting. Obtain the required approvals before enabling delivery. [India messaging guidelines](https://www.twilio.com/en-us/guidelines/in/sms) and [sender registration instructions](https://help.twilio.com/articles/21162166457755-Documents-Required-and-Instructions-to-Register-Your-Alphanumeric-Sender-ID-in-India).
2. In the server secret store set OTP_PROVIDER=twilio, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM to the approved sender and TWILIO_TEMPLATE to the exact approved message with {code} in the variable position. Use a new random production OTP_SECRET. Leave DEV_OTP unset. Restrict destination permissions and set provider spend alerts.
3. Confirm with Twilio that your sender/template mappings are active for this API route. The adapter submits sender, recipient and body. If the chosen account requires explicit additional template or entity parameters, complete that mapping before enabling it.
4. After explicit approval, send a single OTP to a consenting company test handset. Verify carrier receipt, the template, sign-in, expired-code rejection, replay rejection and provider delivery status using the provider console. API acceptance alone does not verify delivery. No live messages were sent during implementation.
