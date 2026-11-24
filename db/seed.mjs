import { database, transaction } from "./connection.mjs";
try {
  if (
    process.env.NODE_ENV !== "development" ||
    !new URL(process.env.DATABASE_URL).pathname.endsWith("_dev")
  )
    throw Error();
  await transaction(async (c) => {
    for (const kind of ["apartment", "design"]) {
      await c.query(
        "INSERT INTO listings(kind,slug,title,description,status,availability) VALUES($1,$2,$3,'Demonstration data for local testing only.','draft',$4) ON CONFLICT(slug) DO NOTHING",
        [
          kind,
          "demo-" + kind,
          "Demo " + kind,
          kind === "apartment" ? "available" : null,
        ],
      );
    }
  });
  console.log("Development drafts seeded.");
} catch {
  console.error(
    "Seed failed. Use a migrated development database ending in _dev and NODE_ENV=development.",
  );
  process.exitCode = 1;
} finally {
  if (process.env.DATABASE_URL) await database().end();
}
