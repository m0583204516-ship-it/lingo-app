import Link from "next/link";
import { demoLoginAction } from "@/lib/actions";
import { AuthScreen } from "@/components/auth-screen";
import { LoginForm } from "@/components/login-form";
import { Button } from "@/components/ui";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;
  return (
    <AuthScreen>
      <h1 className="text-2xl font-black text-navy">כניסה ל-Lingo</h1>
      <p className="mt-1 text-sm text-muted">השתמשו בחשבון קיים או בכניסת הדגמה.</p>
      <LoginForm next={params.next ?? ""} />
      <p className="mt-3 text-center text-sm">
        <Link className="font-semibold text-brand" href="/forgot-password">
          שכחתי סיסמה
        </Link>
      </p>
      <div className="mt-6 grid gap-2">
        <p className="text-xs font-semibold text-slate-500">כניסת הדגמה · הסיסמה בכל החשבונות היא demo123</p>
        <form action={demoLoginAction.bind(null, "learner")}>
          <Button variant="secondary" className="w-full" type="submit">
            לומדת · learner@lingo.app
          </Button>
        </form>
        <form action={demoLoginAction.bind(null, "content")}>
          <Button variant="secondary" className="w-full" type="submit">
            מנהלת תוכן · content@lingo.app
          </Button>
        </form>
        <form action={demoLoginAction.bind(null, "admin")}>
          <Button variant="secondary" className="w-full" type="submit">
            מנהלת מערכת · admin@lingo.app
          </Button>
        </form>
      </div>
      <p className="mt-6 text-center text-sm text-muted">
        אין חשבון?{" "}
        <Link className="font-semibold text-navy" href="/register">
          הרשמה
        </Link>
      </p>
    </AuthScreen>
  );
}
