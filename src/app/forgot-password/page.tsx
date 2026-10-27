"use client";

import Link from "next/link";
import { useState } from "react";
import { forgotPasswordAction } from "@/lib/actions";
import { Button, Field, Input } from "@/components/ui";
import { AuthScreen } from "@/components/auth-screen";

export default function ForgotPasswordPage() {
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  return (
    <AuthScreen>
      <h1 className="text-2xl font-black text-navy">איפוס סיסמה</h1>
      <p className="mt-1 text-sm text-muted">אם החשבון קיים, נשלח קישור מאובטח למייל. לא נחשוף אם הכתובת רשומה.</p>
      {done ? (
        <p className="mt-6 rounded-xl bg-emerald-50 p-4 text-sm font-semibold text-success">
          אם קיים חשבון התואם לפרטים, תקבלו הודעה בקרוב.
        </p>
      ) : (
        <form
          className="mt-6 space-y-4"
          action={async (formData) => {
            const result = await forgotPasswordAction(formData);
            if (result.ok) setDone(true);
            else if ("error" in result) setError(result.error);
          }}
        >
          <Field label="דוא״ל">
            <Input name="email" type="email" required />
          </Field>
          {error ? <p className="text-sm font-semibold text-danger">{error}</p> : null}
          <Button className="w-full" type="submit">
            שליחת קישור
          </Button>
        </form>
      )}
      <p className="mt-6 text-center text-sm">
        <Link className="font-semibold text-navy" href="/login">
          חזרה לכניסה
        </Link>
      </p>
    </AuthScreen>
  );
}
