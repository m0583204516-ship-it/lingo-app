import { redirect } from "next/navigation";
import { TutorChat } from "@/components/tutor-chat";
import { dailyAiLimit, usedAiToday } from "@/lib/store";
import { getCurrentUser } from "@/lib/session";

export default async function TutorPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const remaining = Math.max(0, dailyAiLimit(user.plan) - usedAiToday(user.id));

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-black text-navy">המורה AI</h1>
        <p className="mt-1 text-sm text-muted">שיחה חיה לתרגול ניסוחים, דקדוק ותיקון טעויות. אם המודל החיצוני לא זמין, נכנס מנגנון גיבוי מקומי.</p>
      </div>
      <TutorChat remaining={remaining} />
    </div>
  );
}
