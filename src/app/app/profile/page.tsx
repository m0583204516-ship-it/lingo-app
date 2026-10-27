import { redirect } from "next/navigation";
import { deleteAccountAction, logoutAction, updateProfileAction, upgradePlanAction } from "@/lib/actions";
import { Button, Field, Input, Select } from "@/components/ui";
import { PLAN_LABEL } from "@/lib/labels";
import { getCurrentUser } from "@/lib/session";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-navy">פרופיל והגדרות</h1>
        <p className="mt-1 text-sm text-muted">חשבון, מנוי, העדפות התראה ומחיקה מאובטחת.</p>
      </div>

      <form action={updateProfileAction} className="card space-y-4 p-6">
        <h2 className="font-bold">פרטי חשבון</h2>
        <Field label="שם">
          <Input name="fullName" defaultValue={user.fullName} />
        </Field>
        <Field label="דוא״ל">
          <Input value={user.email} disabled />
        </Field>
        <Field label="יעד יומי">
          <Select name="dailyMinutes" defaultValue={String(user.dailyMinutes)}>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="30">30</option>
            <option value="45">45</option>
          </Select>
        </Field>
        <Button type="submit">שמירת העדפות</Button>
      </form>

      <section className="card p-6">
        <h2 className="font-bold">מנוי</h2>
        <p className="mt-2 text-sm text-muted">תוכנית נוכחית: {PLAN_LABEL[user.plan]}</p>
        {user.plan === "free" ? (
          <form action={upgradePlanAction} className="mt-4">
            <Button type="submit">שדרוג ל-Pro בהדגמה</Button>
          </form>
        ) : (
          <p className="mt-3 text-sm font-semibold text-success">גישה מלאה לספרייה ומכסת AI מורחבת.</p>
        )}
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <form action={logoutAction} className="card p-6">
          <h2 className="font-bold">יציאה</h2>
          <Button className="mt-4" variant="secondary" type="submit">
            התנתקות
          </Button>
        </form>
        <form action={deleteAccountAction} className="card p-6">
          <h2 className="font-bold text-danger">מחיקת חשבון</h2>
          <p className="mt-2 text-sm text-muted">פעולה זו מוחקת את המשתמש מהחנות המקומית ואינה ניתנת לשחזור בהדגמה.</p>
          <Button className="mt-4" variant="danger" type="submit">
            מחיקה מאובטחת
          </Button>
        </form>
      </div>
    </div>
  );
}
