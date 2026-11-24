import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";
import { TOTP } from "otpauth";
function master() {
  const value = process.env.MFA_ENCRYPTION_KEY || "";
  if (!/^[a-f0-9]{64}$/i.test(value))
    throw Error("Configure MFA_ENCRYPTION_KEY");
  return Buffer.from(value, "hex");
}
export function seal(secret) {
  if (!/^[A-Z2-7]{32,64}$/.test(secret))
    throw Error("Invalid authenticator secret");
  const iv = randomBytes(12),
    cipher = createCipheriv("aes-256-gcm", master(), iv);
  const value = Buffer.concat([cipher.update(secret, "ascii"), cipher.final()]);
  return [iv, cipher.getAuthTag(), value]
    .map((b) => b.toString("hex"))
    .join(".");
}
export function stepFor(ciphertext, token) {
  if (typeof token !== "string" || !/^\d{6}$/.test(token)) return null;
  const [iv, tag, data] = ciphertext
    .split(".")
    .map((s) => Buffer.from(s, "hex"));
  const decrypt = createDecipheriv("aes-256-gcm", master(), iv);
  decrypt.setAuthTag(tag);
  const secret = Buffer.concat([
    decrypt.update(data),
    decrypt.final(),
  ]).toString("ascii");
  const clock = Date.now(),
    delta = new TOTP({ secret }).validate({
      token,
      timestamp: clock,
      window: 1,
    });
  return delta === null ? null : Math.floor(clock / 30000) + delta;
}
