"use client";

import { useState } from "react";
import { completeDailyChallengeAction } from "@/lib/actions";
import { DAILY_CHALLENGE } from "@/lib/seed";
import { Button } from "./ui";

export function DailyChallenge({ alreadyDone }: { alreadyDone: boolean }) {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(alreadyDone);
  const [awarded, setAwarded] = useState<number | null>(null);
  const [picked, setPicked] = useState("");
  const item = DAILY_CHALLENGE.items[index];

  if (done) {
    return (
      <div className="card p-6">
        <h2 className="text-lg font-bold">האתגר היומי הושלם</h2>
        <p className="mt-2 text-sm text-muted">
          {awarded ? `נוספו ${awarded} נקודות.` : "הניקוד לא ניתן פעמיים באותו יום."}
        </p>
      </div>
    );
  }

  async function choose(option: string) {
    setPicked(option);
    const ok = option === item.answer;
    const nextScore = score + (ok ? 1 : 0);
    if (index + 1 >= DAILY_CHALLENGE.items.length) {
      const result = await completeDailyChallengeAction(nextScore);
      setDone(true);
      if (result.ok) setAwarded(result.points);
      return;
    }
    setScore(nextScore);
    setIndex((value) => value + 1);
    setPicked("");
  }

  return (
    <div className="card p-6">
      <p className="text-xs font-bold text-slate-500">
        {index + 1} / {DAILY_CHALLENGE.items.length}
      </p>
      <h2 className="mt-2 text-xl font-bold">{DAILY_CHALLENGE.title}</h2>
      <p className="mt-4 text-lg font-black text-navy">{item.prompt}</p>
      <div className="mt-4 grid gap-2">
        {item.options.map((option) => (
          <Button
            key={option}
            type="button"
            variant={picked === option ? "primary" : "secondary"}
            onClick={() => choose(option)}
          >
            <span className="ltr-en">{option}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
