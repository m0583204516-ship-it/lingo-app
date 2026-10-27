export type Role = "learner" | "content" | "admin";
export type PlanType = "free" | "pro";
export type Level = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
export type Skill = "conversation" | "grammar" | "vocabulary" | "listening" | "reading" | "writing";
export type ContentStatus = "draft" | "review" | "published";
export type LessonStatus = "not_started" | "in_progress" | "completed";
export type ActivityType = "multiple_choice" | "order_words" | "type_answer" | "listening";

export type User = {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: Role;
  plan: PlanType;
  level: Level;
  targetLevel: Level;
  dailyMinutes: number;
  goals: Skill[];
  onboarded: boolean;
  streak: number;
  lastActiveDate: string;
  points: number;
  passwordSalt: string;
  passwordHash: string;
  createdAt: string;
};

export type Course = {
  id: string;
  title: string;
  description: string;
  level: Level;
  skill: Skill;
  topic: string;
  durationMin: number;
  isPremium: boolean;
  status: ContentStatus;
  unitCount: number;
};

export type Unit = {
  id: string;
  courseId: string;
  title: string;
  order: number;
  estimatedMin: number;
};

export type Lesson = {
  id: string;
  unitId: string;
  courseId: string;
  title: string;
  summary: string;
  contentType: "lesson";
  order: number;
};

export type Choice = { id: string; text: string };

export type Activity = {
  id: string;
  lessonId: string;
  type: ActivityType;
  prompt: string;
  promptHe: string;
  choices?: Choice[];
  answer: string | string[];
  explanation: string;
};

export type Attempt = {
  id: string;
  userId: string;
  activityId: string;
  lessonId: string;
  score: number;
  answers: string[];
  createdAt: string;
};

export type PointEntry = {
  id: string;
  userId: string;
  points: number;
  reason: string;
  sourceKey: string;
  createdAt: string;
};

export type AiMessage = {
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

export type AiSession = {
  id: string;
  userId: string;
  messages: AiMessage[];
  promptTokens: number;
  costCredits: number;
  dateKey: string;
};

export type AuditLog = {
  id: string;
  actorId: string;
  action: string;
  target: string;
  createdAt: string;
};

export type EmailLog = {
  id: string;
  to: string;
  template: string;
  createdAt: string;
};
