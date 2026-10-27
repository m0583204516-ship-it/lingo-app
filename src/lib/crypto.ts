import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "crypto";

const KEY_LEN = 64;

export function createSalt() {
  return randomBytes(16).toString("hex");
}

export function hashPassword(password: string, salt: string) {
  return scryptSync(password, salt, KEY_LEN).toString("hex");
}

export function verifyPassword(password: string, salt: string, hash: string) {
  const next = hashPassword(password, salt);
  const a = Buffer.from(next, "hex");
  const b = Buffer.from(hash, "hex");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function signValue(value: string, secret: string) {
  const sig = createHmac("sha256", secret).update(value).digest("hex");
  return `${value}.${sig}`;
}

export function readSignedValue(token: string, secret: string) {
  const idx = token.lastIndexOf(".");
  if (idx <= 0) return null;
  const value = token.slice(0, idx);
  const sig = token.slice(idx + 1);
  const expected = createHmac("sha256", secret).update(value).digest("hex");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return null;
  if (!timingSafeEqual(a, b)) return null;
  return value;
}

export function uid(prefix: string) {
  return `${prefix}_${randomBytes(6).toString("hex")}`;
}
