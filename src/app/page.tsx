import Link from "next/link";
import { BookOpen, Bot, Route, Sparkles, Target } from "lucide-react";
import { Logo } from "@/components/shell";
import { getCurrentUser } from "@/lib/session";

export default async function HomePage() {
  const user = await getCurrentUser();
  const startHref = user ? (user.role === "admin" ? "/admin" : user.role === "content" ? "/content" : "/app/dashboard") : "/login";

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#dbeafe,_#f1f5f9_42%)]">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <Logo />
        <div className="flex items-center gap-3">
          <Link className="focus-ring rounded-xl px-3 py-2 text-sm font-semibold text-navy" href="/login">
            כניסה
          </Link>
          <Link
            className="focus-ring rounded-xl bg-navy px-4 py-2 text-sm font-semibold text-white"
            href={user ? startHref : "/register"}
          >
            {user ? "המשיכו ללמוד" : "הרשמה"}
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-20 pt-8">
        <section className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-bold text-navy shadow-sm">
              <Sparkles size={14} /> מסלול אישי + ספרייה פתוחה + מורה AI
            </p>
            <h1 className="mt-5 text-4xl font-black leading-tight text-navy md:text-5xl">
              לימוד אנגלית חכם, בקצב שלכם.
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-8 text-muted">
              אבחון רמה, תוכנית מותאמת, תרגול מיידי ומשוב בונה — בלי להתפזר בין אפליקציות.
              אפשר ללכת אחרי המסלול או לבחור חופשי מהספרייה.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link className="focus-ring rounded-xl bg-navy px-5 py-3 text-sm font-bold text-white" href="/register">
                התחילו בחינם
              </Link>
              <Link className="focus-ring rounded-xl border border-line bg-white px-5 py-3 text-sm font-bold text-navy" href="/login">
                כניסת הדגמה
              </Link>
            </div>
          </div>
          <div className="card p-6">
            <p className="text-sm font-bold text-navy">מה מחכה בלוח הבקרה</p>
            <div className="mt-4 grid gap-3">
              {[
                ["רצף למידה", "3 ימים · יעד יומי 20 דק׳"],
                ["המשימה הבאה", "How are you? · A1 שיחה"],
                ["מכסת AI", "5 הודעות ביום בתוכנית החינמית"],
              ].map(([title, body]) => (
                <div key={title} className="rounded-2xl bg-canvas px-4 py-3">
                  <p className="text-sm font-bold">{title}</p>
                  <p className="text-sm text-muted">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-16 grid gap-4 md:grid-cols-3">
          {[
            { Icon: Target, title: "אבחון והתאמה", body: "מטרות, זמן יומי ומבדק רמה — או דילוג ישר למסלול בסיס." },
            { Icon: Route, title: "מסלול + בחירה חופשית", body: "תוכנית מומלצת, בלי לנעול אתכם. הספרייה תמיד פתוחה." },
            { Icon: Bot, title: "תרגול עם משוב", body: "שיעורים אינטראקטיביים, מורה AI עם מכסה ברורה, ומשחקים להתמדה." },
          ].map((item) => (
            <article key={item.title} className="card p-6">
              <item.Icon className="text-brand" />
              <h2 className="mt-4 text-lg font-bold">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{item.body}</p>
            </article>
          ))}
        </section>

        <section className="card mt-10 p-6 md:p-8">
          <div className="flex items-start gap-3">
            <BookOpen className="mt-1 text-brand" />
            <div>
              <h2 className="text-xl font-bold">למי זה מיועד</h2>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-muted">
                לומדות ולומדים מ-A1 עד C2, מנהלות תוכן שמכינות שיעורים וטיוטות, ומנהלות מערכת
                שאחראיות על תפקידים, מכסות ומעקב. ההרשאות נאכפות בצד השרת — הממשק רק מציג את מה שמותר.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
