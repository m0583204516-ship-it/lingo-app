import Link from "next/link";
import { redirect } from "next/navigation";
import { Badge, ProgressBar } from "@/components/ui";
import { pathUnits } from "@/lib/learning";
import { getCurrentUser } from "@/lib/session";

const STATUS: Record<string, string> = {
  not_started: "טרם התחיל",
  in_progress: "בתהליך",
  completed: "הושלם",
};

export default async function PathPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const units = pathUnits(user);
  const overall = Math.round(units.reduce((sum, unit) => sum + unit.progress, 0) / Math.max(units.length, 1));

  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-3xl font-black text-navy">המסלול האישי</h1>
        <p className="mt-1 text-sm text-muted">מותאם למטרות ולרמה שלכם, עם אפשרות מעבר חופשי לכל שיעור.</p>
        <div className="mt-4 max-w-md">
          <ProgressBar value={overall} />
          <p className="mt-2 text-sm font-semibold">{overall}% מהמסלול הנוכחי</p>
        </div>
      </section>

      <div className="space-y-4">
        {units.map((unit) => (
          <article key={unit.id} className="card p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-slate-500">{unit.course.title}</p>
                <h2 className="text-lg font-bold">{unit.title}</h2>
              </div>
              <Badge>{unit.estimatedMin} דק׳ משוערות</Badge>
            </div>
            <div className="mt-4 space-y-2">
              {unit.lessons.map((lesson) => (
                <Link
                  key={lesson.id}
                  href={`/app/lesson/${lesson.id}`}
                  className="flex items-center justify-between rounded-xl bg-canvas px-4 py-3 hover:bg-brand-soft"
                >
                  <div>
                    <p className="font-semibold">{lesson.title}</p>
                    <p className="text-xs text-muted">{STATUS[lesson.status]}</p>
                  </div>
                  <span className="text-sm font-bold text-navy">{lesson.score == null ? "—" : `${lesson.score}%`}</span>
                </Link>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
