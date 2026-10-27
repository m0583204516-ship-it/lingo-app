import { cookies } from "next/headers";
import { readSignedValue, signValue } from "./crypto";
import { getStore } from "./store";
import type { User } from "./types";

const COOKIE = "lingo_session";

function secret() {
  return process.env.SESSION_SECRET ?? "lingo-demo-secret-change-me";
}

export async function setSession(userId: string) {
  const jar = await cookies();
  jar.set(COOKIE, signValue(userId, secret()), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
}

export async function clearSession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function getCurrentUser(): Promise<User | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  const userId = readSignedValue(token, secret());
  if (!userId) return null;
  return getStore().users.find((user) => user.id === userId) ?? null;
}
