import Link from "next/link";
import { dailyAiLimit, usedAiToday } from "@/lib/store";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { recommendedLesson } from "@/lib/learning";
import { Badge, ProgressBar } from "@/components/ui";
import { LESSONS } from "@/lib/seed";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const nextLesson = recommendedLesson(user);
  const used = usedAiToday(user.id);
  const limit = dailyAiLimit(user.plan);
  const quota = Math.round((used / limit) * 100);

  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm font-semibold text-brand">לוח הבקרה</p>
        <h1 className="text-3xl font-black text-navy">שלום {user.fullName.split(" ")[0]}, מוכנים לשיעור?</h1>
        <p className="mt-1 text-sm text-muted">יעד יומי {user.dailyMinutes} דקות · רמה נוכחית {user.level} · יעד {user.targetLevel}</p>
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        <article className="card p-5 lg:col-span-2">
          <p className="text-xs font-bold text-slate-500">המשימה המומלצת</p>
          <h2 className="mt-2 text-xl font-bold">{nextLesson.title}</h2>
          <p className="ltr-en mt-1 text-sm text-muted">{nextLesson.summary}</p>
          <Link
            className="focus-ring mt-4 inline-flex min-h-11 items-center rounded-xl bg-navy px-4 text-sm font-bold text-white"
            href={`/app/lesson/${nextLesson.id}`}
          >
            המשך לשיעור
          </Link>
        </article>
        <article className="card p-5">
          <p className="text-xs font-bold text-slate-500">יעד יומי</p>
          <p className="mt-3 text-3xl font-black text-navy">{user.dailyMinutes} דק׳</p>
          <p className="mt-2 text-sm text-muted">רצף נוכחי {user.streak} ימים</p>
          <div className="mt-4">
            <ProgressBar value={Math.min(100, (user.streak % 7) * 14 + 20)} />
          </div>
        </article>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <article className="card p-5">
          <p className="text-xs font-bold text-slate-500">נקודות</p>
          <p className="mt-2 text-2xl font-black">{user.points}</p>
          <p className="text-sm text-muted">ניקוד נרשם פעם אחת לכל תרגיל</p>
        </article>
        <article className="card p-5">
          <p className="text-xs font-bold text-slate-500">מכסת AI להיום</p>
          <p className="mt-2 text-2xl font-black">
            {used}/{limit}
          </p>
          <div className="mt-3">
            <ProgressBar value={quota} />
          </div>
          {used >= limit ? (
            <p className="mt-2 text-sm font-semibold text-danger">המכסה להיום הסתיימה.</p>
          ) : (
            <Link className="mt-3 inline-block text-sm font-bold text-brand" href="/app/tutor">
              פתיחת המורה
            </Link>
          )}
        </article>
        <article className="card p-5">
          <p className="text-xs font-bold text-slate-500">קיצורים</p>
          <div className="mt-3 flex flex-col gap-2 text-sm font-semibold">
            <Link className="text-navy" href="/app/library">
              ספריית הלמידה
            </Link>
            <Link className="text-navy" href="/app/games">
              אתגר יומי
            </Link>
            <Link className="text-navy" href="/app/progress">
              דוחות התקדמות
            </Link>
          </div>
        </article>
      </div>

      <section className="card p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-bold">שיעורים זמינים</h2>
          <Badge>חינם ופרימיום מסומנים בספרייה</Badge>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {LESSONS.slice(0, 3).map((lesson) => (
            <Link key={lesson.id} href={`/app/lesson/${lesson.id}`} className="rounded-2xl bg-canvas p-4 hover:bg-brand-soft">
              <p className="font-bold">{lesson.title}</p>
              <p className="ltr-en mt-1 text-xs text-muted">{lesson.summary}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
