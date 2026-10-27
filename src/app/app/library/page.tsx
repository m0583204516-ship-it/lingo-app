import Link from "next/link";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui";
import { SKILL_LABEL } from "@/lib/labels";
import { publishedCourses } from "@/lib/learning";
import { getCurrentUser } from "@/lib/session";
import type { Level, Skill } from "@/lib/types";

export default async function LibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ level?: string; skill?: string; topic?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const params = await searchParams;
  const courses = publishedCourses().filter((course) => {
    if (params.level && course.level !== params.level) return false;
    if (params.skill && course.skill !== params.skill) return false;
    if (params.topic && course.topic !== params.topic) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-3xl font-black text-navy">ספריית הלמידה</h1>
        <p className="mt-1 text-sm text-muted">קורסים, מאמרים ותרגילים לפי רמה, מיומנות ונושא.</p>
      </section>

      <form className="card grid gap-3 p-4 md:grid-cols-4">
        <select name="level" defaultValue={params.level ?? ""} className="h-11 rounded-xl border border-line px-3 text-sm">
          <option value="">כל הרמות</option>
          {["A1", "A2", "B1", "B2", "C1", "C2"].map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
        <select name="skill" defaultValue={params.skill ?? ""} className="h-11 rounded-xl border border-line px-3 text-sm">
          <option value="">כל המיומנויות</option>
          {Object.entries(SKILL_LABEL).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <select name="topic" defaultValue={params.topic ?? ""} className="h-11 rounded-xl border border-line px-3 text-sm">
          <option value="">כל הנושאים</option>
          <option value="daily">יומיום</option>
          <option value="grammar">דקדוק</option>
          <option value="travel">עיר ונסיעות</option>
          <option value="work">עבודה</option>
        </select>
        <button className="h-11 rounded-xl bg-navy text-sm font-bold text-white" type="submit">
          סינון
        </button>
      </form>

      {courses.length === 0 ? (
        <div className="card p-8 text-center">
          <h2 className="font-bold">אין תוכן מתאים לסינון</h2>
          <p className="mt-2 text-sm text-muted">נסו להסיר מסנן אחד או לעבור לספרייה המלאה.</p>
          <Link className="mt-4 inline-block font-semibold text-brand" href="/app/library">
            ניקוי סינון
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {courses.map((course) => {
            const locked = course.isPremium && user.plan !== "pro";
            return (
              <article key={course.id} className="card p-5">
                <div className="flex gap-2">
                  <Badge>{course.level as Level}</Badge>
                  <Badge tone="slate">{SKILL_LABEL[course.skill as Skill]}</Badge>
                  <Badge tone={course.isPremium ? "gold" : "green"}>{course.isPremium ? "פרימיום" : "חינמי"}</Badge>
                </div>
                <h2 className="mt-3 text-lg font-bold">{course.title}</h2>
                <p className="mt-1 text-sm leading-6 text-muted">{course.description}</p>
                <p className="mt-3 text-xs text-slate-500">{course.durationMin} דק׳ · {course.unitCount} יחידות</p>
                {locked ? (
                  <p className="mt-4 text-sm font-semibold text-gold">תוכן פרימיום · שדרגו בפרופיל כדי לפתוח</p>
                ) : (
                  <Link className="mt-4 inline-block text-sm font-bold text-brand" href={`/app/library/${course.id}`}>
                    פתיחת הקורס
                  </Link>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
