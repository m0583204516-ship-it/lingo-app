import type { Level, PlanType, Role, Skill } from "./types";

export const SKILL_LABEL: Record<Skill, string> = {
  conversation: "שיחה",
  grammar: "דקדוק",
  vocabulary: "אוצר מילים",
  listening: "האזנה",
  reading: "קריאה",
  writing: "כתיבה",
};

export const ROLE_LABEL: Record<Role, string> = {
  learner: "לומדת",
  content: "מנהלת תוכן",
  admin: "מנהלת מערכת",
};

export const PLAN_LABEL: Record<PlanType, string> = {
  free: "חינמית",
  pro: "Pro",
};

export const LEVELS: Level[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
