"use client";

import Link from "next/link";
import { useState } from "react";
import { registerAction } from "@/lib/actions";
import { Button, Field, Input } from "@/components/ui";
import { AuthScreen } from "@/components/auth-screen";

export default function RegisterPage() {
  const [error, setError] = useState("");

  return (
    <AuthScreen>
      <h1 className="text-2xl font-black text-navy">יצירת חשבון</h1>
      <p className="mt-1 text-sm text-muted">נבדוק תקינות בצד הלקוח והשרת, בלי לחשוף מידע רגיש בשגיאות.</p>
      <form
        className="mt-6 space-y-4"
        action={async (formData) => {
          const result = await registerAction(formData);
          if (result && "error" in result) setError(result.error);
        }}
      >
        <Field label="שם מלא">
          <Input name="fullName" required minLength={2} autoComplete="name" />
        </Field>
        <Field label="דוא״ל">
          <Input name="email" type="email" required autoComplete="email" />
        </Field>
        <Field label="סיסמה" hint="לפחות 8 תווים">
          <Input name="password" type="password" required minLength={8} autoComplete="new-password" />
        </Field>
        <label className="flex items-start gap-2 text-sm text-muted">
          <input className="mt-1 h-4 w-4" type="checkbox" name="terms" required />
          קראתי ואני מאשר/ת את תנאי השימוש ומדיניות הפרטיות.
        </label>
        {error ? <p className="text-sm font-semibold text-danger">{error}</p> : null}
        <Button className="w-full" type="submit">
          הרשמה והמשך לאבחון
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-muted">
        כבר רשומים?{" "}
        <Link className="font-semibold text-navy" href="/login">
          כניסה
        </Link>
      </p>
    </AuthScreen>
  );
}
