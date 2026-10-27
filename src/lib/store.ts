import { mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import { createSalt, hashPassword, uid } from "./crypto";
import { COURSES, DEMO_PASSWORD } from "./seed";
import type {
  AiSession,
  Attempt,
  AuditLog,
  Course,
  EmailLog,
  PointEntry,
  User,
} from "./types";

export type StoreData = {
  users: User[];
  courses: Course[];
  attempts: Attempt[];
  points: PointEntry[];
  aiSessions: AiSession[];
  audit: AuditLog[];
  emails: EmailLog[];
};

const STORE_PATH = path.join(process.cwd(), ".data", "demo-store.json");

declare global {
  var __lingoStore: StoreData | undefined;
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function makeUser(
  partial: Omit<User, "passwordSalt" | "passwordHash" | "createdAt" | "points" | "streak" | "lastActiveDate"> & {
    password?: string;
  },
): User {
  const salt = createSalt();
  return {
    ...partial,
    points: 40,
    streak: 3,
    lastActiveDate: todayKey(),
    passwordSalt: salt,
    passwordHash: hashPassword(partial.password ?? DEMO_PASSWORD, salt),
    createdAt: new Date().toISOString(),
  };
}

function seedStore(): StoreData {
  return {
    users: [
      makeUser({
        id: "user-maya",
        email: "learner@lingo.app",
        fullName: "מאיה כהן",
        role: "learner",
        plan: "free",
        level: "A2",
        targetLevel: "B1",
        dailyMinutes: 20,
        goals: ["conversation", "grammar"],
        onboarded: true,
      }),
      makeUser({
        id: "user-content",
        email: "content@lingo.app",
        fullName: "נועה לוי",
        role: "content",
        plan: "pro",
        level: "C1",
        targetLevel: "C2",
        dailyMinutes: 30,
        goals: ["writing"],
        onboarded: true,
      }),
      makeUser({
        id: "user-admin",
        email: "admin@lingo.app",
        fullName: "דני אדמין",
        role: "admin",
        plan: "pro",
        level: "C2",
        targetLevel: "C2",
        dailyMinutes: 15,
        goals: ["reading"],
        onboarded: true,
      }),
    ],
    courses: COURSES.map((course) => ({ ...course })),
    attempts: [],
    points: [
      {
        id: "pts-seed",
        userId: "user-maya",
        points: 40,
        reason: "התחלה בפלטפורמה",
        sourceKey: "welcome",
        createdAt: new Date().toISOString(),
      },
    ],
    aiSessions: [],
    audit: [],
    emails: [],
  };
}

function loadFromDisk(): StoreData | null {
  try {
    const raw = readFileSync(STORE_PATH, "utf8");
    return JSON.parse(raw) as StoreData;
  } catch {
    return null;
  }
}

function persist(data: StoreData) {
  mkdirSync(path.dirname(STORE_PATH), { recursive: true });
  writeFileSync(STORE_PATH, JSON.stringify(data, null, 2), "utf8");
}

export function getStore(): StoreData {
  if (!globalThis.__lingoStore) {
    globalThis.__lingoStore = loadFromDisk() ?? seedStore();
    persist(globalThis.__lingoStore);
  }
  return globalThis.__lingoStore;
}

export function saveStore() {
  persist(getStore());
}

export function addAudit(actorId: string, action: string, target: string) {
  const store = getStore();
  store.audit.unshift({
    id: uid("audit"),
    actorId,
    action,
    target,
    createdAt: new Date().toISOString(),
  });
  saveStore();
}

export function addEmail(to: string, template: string) {
  const store = getStore();
  const exists = store.emails.some(
    (item) => item.to === to && item.template === template && item.createdAt.slice(0, 16) === new Date().toISOString().slice(0, 16),
  );
  if (exists) return;
  store.emails.unshift({
    id: uid("mail"),
    to,
    template,
    createdAt: new Date().toISOString(),
  });
  saveStore();
}

export function dailyAiLimit(plan: User["plan"]) {
  return plan === "pro" ? 40 : 5;
}

export function usedAiToday(userId: string) {
  const key = todayKey();
  return getStore().aiSessions.filter((session) => session.userId === userId && session.dateKey === key).reduce((sum, session) => sum + session.costCredits, 0);
}

export function lessonScore(userId: string, lessonId: string) {
  const attempts = getStore().attempts.filter((item) => item.userId === userId && item.lessonId === lessonId);
  if (!attempts.length) return null;
  const latestByActivity = new Map<string, Attempt>();
  for (const attempt of attempts) latestByActivity.set(attempt.activityId, attempt);
  const values = [...latestByActivity.values()];
  return Math.round(values.reduce((sum, item) => sum + item.score, 0) / values.length);
}
