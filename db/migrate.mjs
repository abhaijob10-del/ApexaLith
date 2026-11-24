import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import { database, transaction } from "./connection.mjs";

const dir = new URL("./migrations/", import.meta.url);
try {
  await transaction(async (client) => {
    await client.query("SELECT pg_advisory_xact_lock(1746938271)");
    await client.query("CREATE SCHEMA IF NOT EXISTS apexalith");
    await client.query("SET LOCAL search_path = apexalith, pg_catalog");
    await client.query(
      "CREATE TABLE IF NOT EXISTS migrations (name text PRIMARY KEY, checksum text NOT NULL, applied_at timestamptz DEFAULT now())",
    );
    for (const name of (await readdir(dir))
      .filter((n) => /^\d+_[\w-]+\.sql$/.test(n))
      .sort()) {
      const sql = (await readFile(new URL(name, dir), "utf8")).replace(
        /\r\n/g,
        "\n",
      );
      const checksum = createHash("sha256").update(sql).digest("hex");
      const { rows } = await client.query(
        "SELECT checksum FROM migrations WHERE name=$1",
        [name],
      );
      if (rows.length) {
        if (rows[0].checksum !== checksum)
          throw new Error("Migration checksum mismatch");
        continue;
      }
      await client.query(sql);
      await client.query(
        "INSERT INTO migrations(name,checksum) VALUES ($1,$2)",
        [name, checksum],
      );
      console.info("Applied", name);
    }
  });
} catch (err) {
  console.error(
    JSON.stringify({
      event: "migration_failed",
      code: err.code || "configuration_or_migration_error",
    }),
  );
  process.exitCode = 1;
} finally {
  if (process.env.DATABASE_URL) await database().end();
}
