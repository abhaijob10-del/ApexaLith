import { seal } from "../backend/mfa.mjs";
import { database, transaction } from "../db/connection.mjs";
import { hashPassword } from "../backend/security.mjs";
try {
  const [operation, address] = process.argv.slice(2);
  const email = address?.trim().toLowerCase();
  if (
    !["create", "reset", "enable-mfa", "disable-mfa"].includes(operation) ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || "")
  )
    throw Error();
  if (process.stdin.isTTY) throw Error();
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  const input = Buffer.concat(chunks).toString("utf8").replace(/\r?\n$/, "");
  const hash =
    operation === "enable-mfa"
      ? seal(input)
      : operation === "disable-mfa"
        ? null
        : await hashPassword(input);
  await transaction(async (client) => {
    const result =
      operation === "create"
        ? await client.query(
            "INSERT INTO users(role,email,password_hash) VALUES('admin',$1,$2) RETURNING id",
            [email, hash],
          )
        : operation.endsWith("-mfa")
          ? await client.query(
              "UPDATE users SET mfa_ciphertext=$2,mfa_last_step=NULL WHERE role='admin' AND email=$1 RETURNING id",
              [email, hash],
            )
          : await client.query(
              "UPDATE users SET password_hash=$2 WHERE role='admin' AND email=$1 RETURNING id",
              [email, hash],
            );
    if (!result.rowCount) throw Error();
    const id = result.rows[0].id;
    await client.query("DELETE FROM sessions WHERE user_id=$1", [id]);
    await client.query(
      "INSERT INTO audit_log(actor_id,action) VALUES ($1,$2)",
      [id, "admin_cli_" + operation],
    );
  });
  console.log("Administrator account updated.");
} catch {
  console.error(
    "Administrator operation failed. Check the database, email, operation and password length.",
  );
  process.exitCode = 1;
} finally {
  if (process.env.DATABASE_URL) await database().end();
}
