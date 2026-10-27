"use client";

import { useState } from "react";
import { saveCourseAction } from "@/lib/actions";
import { Button, Field, Input, Select } from "@/components/ui";
import { LEVELS, SKILL_LABEL } from "@/lib/labels";

export function CourseForm() {
  const [message, setMessage] = useState("");

  return (
    <form
      className="card space-y-4 p-6"
      action={async (formData) => {
        const result = await saveCourseAction(formData);
        setMessage(result.ok ? "נשמר." : result.error);
      }}
    >
      <Field label="כותרת">
        <Input name="title" required placeholder="Present Perfect at work" />
      </Field>
      <Field label="תיאור">
        <textarea name="description" required className="min-h-28 w-full rounded-xl border border-line p-3 text-sm" />
      </Field>
      <div className="grid gap-3 md:grid-cols-3">
        <Field label="רמה">
          <Select name="level">
            {LEVELS.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="מיומנות">
          <Select name="skill">
            {Object.entries(SKILL_LABEL).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="משך בדקות">
          <Input name="durationMin" type="number" defaultValue="20" />
        </Field>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isPremium" /> פרימיום
      </label>
      {message ? <p className="text-sm font-semibold text-navy">{message}</p> : null}
      <div className="flex flex-wrap gap-3">
        <Button type="submit" name="intent" value="draft">
          שמירה כטיוטה
        </Button>
        <Button variant="secondary" type="submit" name="intent" value="review">
          שליחה לאישור
        </Button>
      </div>
    </form>
  );
}
