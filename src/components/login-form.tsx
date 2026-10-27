"use client";

import { useState } from "react";
import { loginAction } from "@/lib/actions";
import { Button, Field, Input } from "./ui";

export function LoginForm({ next }: { next: string }) {
  const [error, setError] = useState("");

  return (
    <form
      className="mt-6 space-y-4"
      action={async (formData) => {
        const result = await loginAction(formData);
        if (result && "error" in result) setError(result.error);
      }}
    >
      <input type="hidden" name="next" value={next} />
      <Field label="דוא״ל">
        <Input name="email" type="email" autoComplete="email" required placeholder="you@example.com" />
      </Field>
      <Field label="סיסמה">
        <Input name="password" type="password" autoComplete="current-password" required />
      </Field>
      {error ? <p className="text-sm font-semibold text-danger">{error}</p> : null}
      <Button className="w-full" type="submit">
        כניסה
      </Button>
    </form>
  );
}
