import { redirect } from "next/navigation";
import { ProgressBar } from "@/components/ui";
import { SKILL_LABEL } from "@/lib/labels";
import { skillBreakdown } from "@/lib/learning";
import { getStore } from "@/lib/store";
import { getCurrentUser } from "@/lib/session";
import type { Skill } from "@/lib/types";

export default async function ProgressPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const attempts = getStore().attempts.filter((item) => item.userId === user.id);
  const accuracy = attempts.length
    ? Math.round((attempts.filter((item) => item.score === 100).length / attempts.length) * 100)
    : 0;
  const minutes = Math.round(attempts.length * 1.5);
  const skills = skillBreakdown(user.id);
  const mistakes = attempts.filter((item) => item.score === 0).slice(-5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-navy">ההתקדמות שלי</h1>
        <p className="mt-1 text-sm text-muted">זמן למידה, דיוק, מיומנויות וזיהוי טעויות חוזרות.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <article className="card p-5">
          <p className="text-xs font-bold text-slate-500">זמן למידה משוער</p>
          <p className="mt-2 text-3xl font-black">{minutes} דק׳</p>
        </article>
        <article className="card p-5">
          <p className="text-xs font-bold text-slate-500">דיוק תשובות</p>
          <p className="mt-2 text-3xl font-black">{accuracy}%</p>
        </article>
        <article className="card p-5">
          <p className="text-xs font-bold text-slate-500">תרגילים</p>
          <p className="mt-2 text-3xl font-black">{attempts.length}</p>
        </article>
      </div>
      <section className="card p-5">
        <h2 className="font-bold">לפי מיומנות</h2>
        <div className="mt-4 space-y-4">
          {Object.keys(SKILL_LABEL).map((skill) => {
            const data = skills[skill] ?? { total: 0, correct: 0 };
            const value = data.total ? Math.round((data.correct / data.total) * 100) : 0;
            return (
              <div key={skill}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-semibold">{SKILL_LABEL[skill as Skill]}</span>
                  <span className="text-muted">{data.total ? `${value}%` : "אין נתונים עדיין"}</span>
                </div>
                <ProgressBar value={value} />
              </div>
            );
          })}
        </div>
      </section>
      <section className="card p-5">
        <h2 className="font-bold">טעויות אחרונות לחיזוק</h2>
        {mistakes.length === 0 ? (
          <p className="mt-2 text-sm text-muted">עדיין אין טעויות מתועדות — זה הזמן לשיעור ראשון.</p>
        ) : (
          <ul className="mt-3 space-y-2 text-sm">
            {mistakes.map((item) => (
              <li key={item.id} className="rounded-xl bg-canvas px-3 py-2">
                תרגיל {item.activityId} · תשובה שנשמרה: {item.answers.join(" ")}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
