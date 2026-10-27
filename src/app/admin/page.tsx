import { publishCourseAction, updateUserRoleAction } from "@/lib/actions";
import { Button } from "@/components/ui";
import { PLAN_LABEL, ROLE_LABEL } from "@/lib/labels";
import { getStore } from "@/lib/store";

export default async function AdminPage() {
  const store = getStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-navy">ניהול מערכת</h1>
        <p className="mt-1 text-sm text-muted">משתמשים, תפקידים, אישור תוכן, מכסות ומדדים. פעולות רגישות דורשות התחברות כמנהלת.</p>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <article className="card p-5">
          <p className="text-xs font-bold text-slate-500">משתמשים</p>
          <p className="mt-2 text-3xl font-black">{store.users.length}</p>
        </article>
        <article className="card p-5">
          <p className="text-xs font-bold text-slate-500">שיחות AI</p>
          <p className="mt-2 text-3xl font-black">{store.aiSessions.length}</p>
        </article>
        <article className="card p-5">
          <p className="text-xs font-bold text-slate-500">שגיאות אחרונות</p>
          <p className="mt-2 text-3xl font-black">{store.attempts.filter((item) => item.score === 0).length}</p>
        </article>
      </section>

      <section className="card overflow-x-auto p-5">
        <h2 className="font-bold">משתמשים והרשאות</h2>
        <table className="mt-4 w-full min-w-[640px] text-right text-sm">
          <thead className="text-slate-500">
            <tr>
              <th className="pb-2">שם</th>
              <th className="pb-2">דוא״ל</th>
              <th className="pb-2">תפקיד</th>
              <th className="pb-2">מנוי</th>
              <th className="pb-2">פעולה</th>
            </tr>
          </thead>
          <tbody>
            {store.users.map((user) => (
              <tr key={user.id} className="border-t border-line">
                <td className="py-3 font-semibold">{user.fullName}</td>
                <td>{user.email}</td>
                <td>{ROLE_LABEL[user.role]}</td>
                <td>{PLAN_LABEL[user.plan]}</td>
                <td>
                  <form action={updateUserRoleAction} className="flex gap-2">
                    <input type="hidden" name="userId" value={user.id} />
                    <select name="role" defaultValue={user.role} className="h-10 rounded-lg border px-2">
                      <option value="learner">לומדת</option>
                      <option value="content">תוכן</option>
                      <option value="admin">מערכת</option>
                    </select>
                    <Button type="submit">שמירה</Button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="card p-5">
        <h2 className="font-bold">אישור פרסום תוכן</h2>
        <div className="mt-4 space-y-3">
          {store.courses.filter((course) => course.status !== "published").length === 0 ? (
            <p className="text-sm text-muted">אין טיוטות ממתינות.</p>
          ) : (
            store.courses
              .filter((course) => course.status !== "published")
              .map((course) => (
                <form key={course.id} action={publishCourseAction.bind(null, course.id)} className="flex items-center justify-between rounded-xl bg-canvas px-4 py-3">
                  <div>
                    <p className="font-semibold">{course.title}</p>
                    <p className="text-xs text-muted">{course.status === "review" ? "ממתין לאישור" : "טיוטה"}</p>
                  </div>
                  <Button type="submit">פרסום</Button>
                </form>
              ))
          )}
        </div>
      </section>

      <section className="card p-5">
        <h2 className="font-bold">יומן ביקורת</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {store.audit.slice(0, 8).map((item) => (
            <li key={item.id} className="rounded-xl bg-canvas px-3 py-2">
              {item.action} · {item.target} · {new Date(item.createdAt).toLocaleString("he-IL")}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
