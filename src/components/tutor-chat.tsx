"use client";

import { useState } from "react";
import { sendTutorMessageAction } from "@/lib/actions";
import { Button } from "./ui";

type Message = { role: "user" | "assistant"; content: string };

export function TutorChat({ remaining }: { remaining: number }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! Let's practice. Tell me about your day, or ask for a grammar explanation. I'll correct gently and give one extra example.",
    },
  ]);
  const [input, setInput] = useState("");
  const [left, setLeft] = useState(remaining);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function send() {
    if (!input.trim() || pending) return;
    const text = input.trim();
    setInput("");
    setError("");
    setMessages((current) => [...current, { role: "user", content: text }]);
    setPending(true);
    const result = await sendTutorMessageAction(text);
    setPending(false);
    if (!result.ok) {
      if (result.error === "quota") setError("quota");
      else setError(result.error);
      return;
    }
    setLeft(result.remaining);
    setMessages((current) => [...current, { role: "assistant", content: result.reply }]);
  }

  if (error === "quota" || left <= 0) {
    return (
      <div className="card p-8 text-center">
        <h2 className="text-xl font-black text-navy">המכסה להיום הסתיימה</h2>
        <p className="mt-2 text-sm text-muted">בתוכנית החינמית יש מכסה יומית שמתאפסת בחצות. אפשר להמשיך לתרגל בשיעורים ובמשחקים, או לשדרג ל-Pro.</p>
      </div>
    );
  }

  return (
    <div className="card flex min-h-[70vh] flex-col p-4 md:p-6">
      <div className="flex-1 space-y-3 overflow-y-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${
              message.role === "assistant" ? "bg-canvas text-ink" : "mr-auto bg-navy text-white"
            }`}
          >
            <p className="ltr-en">{message.content}</p>
          </div>
        ))}
        {pending ? <p className="text-sm text-muted">המורה כותב…</p> : null}
      </div>
      {error && error !== "quota" ? <p className="mt-3 text-sm font-semibold text-danger">{error}</p> : null}
      <form
        className="mt-4 flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          void send();
        }}
      >
        <input
          className="ltr-en h-12 flex-1 rounded-xl border border-line px-3"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Write in English..."
          aria-label="הודעה למורה"
        />
        <Button type="submit" disabled={pending}>
          שליחה
        </Button>
      </form>
      <p className="mt-2 text-xs text-muted">נשארו {left} הודעות להיום · הבקשות עוברות בשרת בלי לחשוף מפתחות בדפדפן.</p>
    </div>
  );
}
