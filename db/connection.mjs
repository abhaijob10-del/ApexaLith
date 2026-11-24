import pg from "pg";
import dotenv from "dotenv";

dotenv.config({ path: [".env.local", ".env"], quiet: true });
let pool;
export function database() {
  if (!process.env.DATABASE_URL)
    throw new Error("Set DATABASE_URL in the server environment.");
  if (pool) return pool;
  pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    options: "-c search_path=apexalith,pg_catalog",
    max: 10,
    connectionTimeoutMillis: 5000,
    statement_timeout: 15000,
  });
  pool.on("error",()=>console.error(JSON.stringify({event:"database_connection_error"})));
  return pool;
}
export async function transaction(operation) {
  const client = await database().connect();
  try {
    await client.query("BEGIN");
    const result = await operation(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
