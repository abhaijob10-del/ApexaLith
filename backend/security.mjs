import { createHash, randomBytes, scrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { database } from "../db/connection.mjs";
const derive = promisify(scrypt);
export const digest = (value) =>
  createHash("sha256").update(value).digest("hex");
export const fail = (status, message) =>
  Object.assign(new Error(message), { status });
export const run = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next);
export const query = (sql, args) => database().query(sql, args);
export function field(value, max, required = false) {
  if (value == null && !required) return "";
  if (
    typeof value !== "string" ||
    value.length > max ||
    (required && !value.trim())
  )
    throw fail(400, "Check the required fields.");
  return value.trim();
}
export function phoneNumber(value) {
  const number = field(value, 24, true)
    .replace(/[ ()-]/g, "")
    .replace(/^(?:\+91|91)(?=[6-9]\d{9}$)/, "");
  if (!/^[6-9]\d{9}$/.test(number))
    throw fail(400, "Enter a valid Indian mobile number.");
  return "+91" + number;
}
export async function hashPassword(password) {
  if (
    typeof password !== "string" ||
    password.length < 14 ||
    password.length > 128
  )
    throw fail(400, "Choose a password of 14 to 128 characters.");
  const salt = randomBytes(16).toString("hex");
  const hash = await derive(password, salt, 64, { N: 32768, maxmem: 67108864 });
  return salt + "." + hash.toString("hex");
}
export async function matchesPassword(password, encoded) {
  if (typeof password !== "string" || password.length > 128) return false;
  const [salt, hash] = (encoded || "dummy." + "0".repeat(128)).split(".");
  return timingSafeEqual(
    await derive(password, salt, 64, { N: 32768, maxmem: 67108864 }),
    Buffer.from(hash, "hex"),
  );
}
export async function throttle(key, limit) {
  const { rows } = await query(
    `INSERT INTO rate_limits AS r (key,hits,expires_at) VALUES ($1,1,now()+interval '15 minutes')
    ON CONFLICT(key) DO UPDATE SET hits=CASE WHEN r.expires_at<=now() THEN 1 ELSE r.hits+1 END,
    expires_at=CASE WHEN r.expires_at<=now() THEN excluded.expires_at ELSE r.expires_at END RETURNING hits`,
    [digest(key)],
  );
  if (rows[0].hits > limit)
    throw fail(429, "Too many requests. Try again later.");
}
export const tokenOf = (req) =>
  /(?:^|; )apx_session=([0-9a-f]{64})(?:;|$)/.exec(
    req.headers.cookie || "",
  )?.[1];
export async function currentUser(req) {
  const token = tokenOf(req);
  if (!token) return null;
  const { rows } = await query(
    "SELECT u.id,u.role,u.name,u.email,u.phone FROM users u JOIN sessions s ON s.user_id=u.id WHERE digest=$1 AND expires_at>now()",
    [digest(token)],
  );
  return rows[0] || null;
}
export const requireRole = (role) =>
  run(async (req, res, next) => {
    req.user = await currentUser(req);
    if (!req.user) throw fail(401, "Please sign in.");
    if (req.user.role !== role) throw fail(403, "Access denied.");
    next();
  });
export function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  };
}
export async function newSession(client, user) {
  const token = randomBytes(32).toString("hex");
  await client.query(
    "INSERT INTO sessions VALUES ($1,$2,now()+interval '8 hours')",
    [digest(token), user.id],
  );
  return token;
}
