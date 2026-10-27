import { Badge } from "@/components/ui";
import { getStore } from "@/lib/store";
import { CourseForm } from "./course-form";

export default async function ContentPage() {
  const courses = getStore().courses;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black text-navy">ניהול תוכן</h1>
        <p className="mt-1 text-sm text-muted">יצירת קורסים, שמירת טיוטה, תצוגה מקדימה ושליחה לאישור. אין גישה לנתוני לומדים.</p>
      </div>
      <CourseForm />
      <section className="card p-5">
        <h2 className="font-bold">הקורסים שלי</h2>
        <div className="mt-4 space-y-3">
          {courses.map((course) => (
            <article key={course.id} className="rounded-xl bg-canvas px-4 py-3">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold">{course.title}</p>
                <Badge tone={course.status === "published" ? "green" : course.status === "review" ? "gold" : "slate"}>
                  {course.status === "published" ? "פורסם" : course.status === "review" ? "לאישור" : "טיוטה"}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted">{course.description}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
