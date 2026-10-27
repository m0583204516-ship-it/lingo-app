"use client";

import { useMemo, useState } from "react";
import { submitActivityAction } from "@/lib/actions";
import type { Activity } from "@/lib/types";
import { Button } from "./ui";

function normalize(value: string) {
  return value.trim().toLowerCase().replace(/’/g, "'");
}

function isCorrect(activity: Activity, answers: string[]) {
  if (activity.type === "type_answer") {
    const expected = Array.isArray(activity.answer) ? activity.answer : [activity.answer];
    const extra = activity.id === "act-be-2" ? ["are not", "aren't"] : expected;
    return extra.some((item) => normalize(item) === normalize(answers[0] ?? ""));
  }
  if (activity.type === "order_words") {
    const expected = activity.answer as string[];
    return expected.join(" ") === answers.join(" ");
  }
  return answers[0] === activity.answer;
}

export function LessonPlayer({
  lessonTitle,
  summary,
  activities,
}: {
  lessonTitle: string;
  summary: string;
  activities: Activity[];
}) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<"idle" | "right" | "wrong">("idle");
  const [done, setDone] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const activity = activities[index];
  const pool = useMemo(
    () => (activity?.type === "order_words" ? [...(activity.answer as string[])].sort((a, b) => a.localeCompare(b)) : []),
    [activity],
  );
  const leftover = pool.flatMap((word) => {
    const used = selected.filter((item) => item === word).length;
    const total = pool.filter((item) => item === word).length;
    return Array.from({ length: Math.max(0, total - used) }, () => word);
  });

  if (!activity && !done) return null;

  async function check() {
    const ok = isCorrect(activity, selected);
    setFeedback(ok ? "right" : "wrong");
    if (ok) setCorrectCount((value) => value + 1);
    await submitActivityAction({
      activityId: activity.id,
      lessonId: activity.lessonId,
      answers: selected,
      correct: ok,
    });
  }

  function next() {
    if (index + 1 >= activities.length) {
      setDone(true);
      return;
    }
    setIndex((value) => value + 1);
    setSelected([]);
    setFeedback("idle");
  }

  function speak(text: string) {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  if (done) {
    const percent = Math.round((correctCount / activities.length) * 100);
    return (
      <div className="card p-8 text-center">
        <h2 className="text-2xl font-black text-navy">השיעור הושלם</h2>
        <p className="mt-2 text-sm text-muted">דיוק {percent}% · התוצאה נשמרה והניקוד ניתן פעם אחת לכל תרגיל נכון.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <section className="card p-6">
        <p className="text-xs font-bold text-slate-500">
          תרגיל {index + 1} מתוך {activities.length}
        </p>
        <h1 className="mt-1 text-2xl font-black text-navy">{lessonTitle}</h1>
        <p className="ltr-en mt-1 text-sm text-muted">{summary}</p>
        <p className="mt-4 text-sm font-semibold">{activity.promptHe}</p>
        <p className="ltr-en mt-1 text-lg font-bold">{activity.prompt}</p>
      </section>

      <section className="card p-6">
        {activity.type === "multiple_choice" || activity.type === "listening" ? (
          <div className="grid gap-2">
            {activity.type === "listening" ? (
              <Button type="button" variant="secondary" onClick={() => speak("How are you today?")}>
                האזנה למשפט
              </Button>
            ) : null}
            {activity.choices?.map((choice) => (
              <button
                key={choice.id}
                type="button"
                onClick={() => setSelected([choice.id])}
                className={`min-h-12 rounded-xl border px-4 text-right text-sm font-semibold ${
                  selected[0] === choice.id ? "border-brand bg-brand-soft" : "border-line bg-white"
                }`}
              >
                <span className="ltr-en inline-block">{choice.text}</span>
              </button>
            ))}
          </div>
        ) : null}

        {activity.type === "type_answer" ? (
          <input
            className="ltr-en h-12 w-full rounded-xl border border-line px-3"
            value={selected[0] ?? ""}
            onChange={(event) => setSelected([event.target.value])}
            placeholder="Type your answer"
          />
        ) : null}

        {activity.type === "order_words" ? (
          <div className="space-y-3">
            <div className="flex min-h-14 flex-wrap gap-2 rounded-xl bg-canvas p-3">
              {selected.map((word, wordIndex) => (
                <button
                  key={`${word}-${wordIndex}`}
                  className="rounded-lg bg-navy px-3 py-2 text-sm font-bold text-white"
                  onClick={() => setSelected(selected.filter((_, idx) => idx !== wordIndex))}
                  type="button"
                >
                  {word}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {leftover.map((word, idx) => (
                <button
                  key={`${word}-pool-${idx}`}
                  type="button"
                  className="rounded-lg border border-line bg-white px-3 py-2 text-sm font-bold"
                  onClick={() => setSelected([...selected, word])}
                >
                  {word}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {feedback !== "idle" ? (
          <p className={`mt-4 text-sm font-semibold ${feedback === "right" ? "text-success" : "text-danger"}`}>
            {feedback === "right" ? "מעולה." : "כמעט."} {activity.explanation}
          </p>
        ) : null}

        <div className="mt-5 flex gap-3">
          {feedback === "idle" ? (
            <Button type="button" onClick={check} disabled={selected.length === 0}>
              בדיקה
            </Button>
          ) : (
            <Button type="button" onClick={next}>
              {index + 1 >= activities.length ? "סיום" : "הבא"}
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}
