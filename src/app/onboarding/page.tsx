import { redirect } from "next/navigation";
import { completeOnboardingAction } from "@/lib/actions";
import { ASSESSMENT_QUESTIONS } from "@/lib/seed";
import { LEVELS, SKILL_LABEL } from "@/lib/labels";
import { getCurrentUser } from "@/lib/session";
import { Button, Field, Select } from "@/components/ui";

export default async function OnboardingPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.onboarded) redirect("/app/dashboard");

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-sm font-bold text-brand">שלב הצטרפות</p>
      <h1 className="mt-1 text-3xl font-black text-navy">מטרות, זמן יומי ואבחון רמה</h1>
      <p className="mt-2 text-sm leading-7 text-muted">
        אפשר לדלג על המבדק ולהתחיל במסלול בסיס. המבדק מותאם מ-A1 עד C2 ומשמש רק להתאמת התוכן.
      </p>

      <form action={completeOnboardingAction} className="card mt-6 space-y-6 p-6">
        <fieldset>
          <legend className="text-sm font-bold">מה חשוב לכם לתרגל?</legend>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {Object.entries(SKILL_LABEL).map(([value, label]) => (
              <label key={value} className="flex min-h-11 items-center gap-2 rounded-xl border border-line px-3 text-sm">
                <input type="checkbox" name="goals" value={value} defaultChecked={value === "conversation"} />
                {label}
              </label>
            ))}
          </div>
        </fieldset>

        <Field label="זמן יומי">
          <Select name="dailyMinutes" defaultValue="20">
            <option value="10">10 דקות</option>
            <option value="20">20 דקות</option>
            <option value="30">30 דקות</option>
            <option value="45">45 דקות</option>
          </Select>
        </Field>

        <Field label="רמת יעד">
          <Select name="targetLevel" defaultValue="B1">
            {LEVELS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </Select>
        </Field>

        <div className="space-y-4">
          <h2 className="text-lg font-bold">מבדק קצר</h2>
          {ASSESSMENT_QUESTIONS.map((question, index) => (
            <fieldset key={question.id} className="rounded-2xl bg-canvas p-4">
              <legend className="text-sm font-bold">
                {index + 1}. <span className="ltr-en inline-block">{question.prompt}</span>
              </legend>
              <div className="mt-3 grid gap-2">
                {question.choices.map((choice) => (
                  <label key={choice} className="flex min-h-11 items-center gap-2 rounded-xl bg-white px-3 text-sm">
                    <input type="radio" name={question.id} value={choice} />
                    <span className="ltr-en">{choice}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <Button type="submit">שמירה והתחלת המסלול</Button>
          <Button variant="secondary" name="skipTest" value="1" type="submit">
            דילוג למסלול בסיס
          </Button>
        </div>
      </form>
    </div>
  );
}
