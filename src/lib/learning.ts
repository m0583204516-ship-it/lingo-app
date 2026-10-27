import { ACTIVITIES, LESSONS, UNITS } from "./seed";
import { getStore, lessonScore } from "./store";
import type { LessonStatus, User } from "./types";

export function publishedCourses() {
  return getStore().courses.filter((course) => course.status === "published");
}

export function canAccessCourse(user: User, courseId: string) {
  const course = getStore().courses.find((item) => item.id === courseId);
  if (!course || course.status !== "published") return false;
  if (course.isPremium && user.plan !== "pro") return false;
  return true;
}

export function lessonStatus(userId: string, lessonId: string): LessonStatus {
  const activities = ACTIVITIES.filter((item) => item.lessonId === lessonId);
  const attempted = new Set(
    getStore()
      .attempts.filter((item) => item.userId === userId && item.lessonId === lessonId)
      .map((item) => item.activityId),
  );
  if (attempted.size === 0) return "not_started";
  if (activities.every((item) => attempted.has(item.id))) return "completed";
  return "in_progress";
}

export function recommendedLesson(user: User) {
  const open = LESSONS.find((lesson) => {
    const course = publishedCourses().find((item) => item.id === lesson.courseId);
    if (!course) return false;
    if (course.isPremium && user.plan !== "pro") return false;
    return lessonStatus(user.id, lesson.id) !== "completed";
  });
  return open ?? LESSONS[0];
}

export function pathUnits(user: User) {
  return UNITS.filter((unit) => {
    const course = publishedCourses().find((item) => item.id === unit.courseId);
    if (!course) return false;
    return course.level <= user.targetLevel;
  }).map((unit) => {
    const lessons = LESSONS.filter((lesson) => lesson.unitId === unit.id);
    const statuses = lessons.map((lesson) => lessonStatus(user.id, lesson.id));
    const completed = statuses.filter((item) => item === "completed").length;
    return {
      ...unit,
      course: publishedCourses().find((item) => item.id === unit.courseId)!,
      lessons: lessons.map((lesson) => ({
        ...lesson,
        status: lessonStatus(user.id, lesson.id),
        score: lessonScore(user.id, lesson.id),
      })),
      progress: lessons.length ? Math.round((completed / lessons.length) * 100) : 0,
    };
  });
}

export function skillBreakdown(userId: string) {
  const bySkill: Record<string, { total: number; correct: number }> = {};
  for (const attempt of getStore().attempts.filter((item) => item.userId === userId)) {
    const activity = ACTIVITIES.find((item) => item.id === attempt.activityId);
    const lesson = LESSONS.find((item) => item.id === attempt.lessonId);
    const course = publishedCourses().find((item) => item.id === lesson?.courseId);
    const skill = course?.skill ?? "conversation";
    bySkill[skill] ??= { total: 0, correct: 0 };
    bySkill[skill].total += 1;
    if (attempt.score === 100) bySkill[skill].correct += 1;
  }
  return bySkill;
}
