import { redirect } from "next/navigation";
import { DailyChallenge } from "@/components/daily-challenge";
import { getStore } from "@/lib/store";
import { getCurrentUser } from "@/lib/session";
import { Badge } from "@/components/ui";

export default async function GamesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const sourceKey = `daily:${user.id}:${new Date().toISOString().slice(0, 10)}`;
  const alreadyDone = getStore().points.some((item) => item.sourceKey === sourceKey);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-navy">משחקים ואתגרים</h1>
        <p className="mt-1 text-sm text-muted">אתגר יומי, אוצר מילים, והישגים. הניקוד נרשם ביומן כדי למנוע כפילות.</p>
      </div>
      <DailyChallenge alreadyDone={alreadyDone} />
      <section className="card p-6">
        <h2 className="font-bold">הישגים</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge tone={user.streak >= 3 ? "gold" : "slate"}>רצף 3 ימים</Badge>
          <Badge tone={user.points >= 50 ? "gold" : "slate"}>50 נקודות</Badge>
          <Badge tone={alreadyDone ? "gold" : "slate"}>אתגר יומי</Badge>
        </div>
      </section>
    </div>
  );
}
