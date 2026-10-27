import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Badge } from "@/components/ui";
import { LESSONS, UNITS } from "@/lib/seed";
import { canAccessCourse, publishedCourses } from "@/lib/learning";
import { getCurrentUser } from "@/lib/session";

export default async function CoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const { courseId } = await params;
  const course = publishedCourses().find((item) => item.id === courseId);
  if (!course) notFound();
  if (!canAccessCourse(user, courseId)) {
    return (
      <div className="card p-8 text-center">
        <h1 className="text-xl font-black text-navy">תוכן פרימיום</h1>
        <p className="mt-2 text-sm text-muted">הקורס הזה כלול בתוכנית Pro. אפשר לשדרג מהפרופיל.</p>
        <Link className="mt-4 inline-block font-bold text-brand" href="/app/profile">
          למנוי
        </Link>
      </div>
    );
  }

  const units = UNITS.filter((unit) => unit.courseId === courseId);
  const lessons = LESSONS.filter((lesson) => lesson.courseId === courseId);

  return (
    <div className="space-y-6">
      <Link href="/app/library" className="text-sm font-semibold text-brand">
        חזרה לספרייה
      </Link>
      <div>
        <div className="flex gap-2">
          <Badge>{course.level}</Badge>
          {course.isPremium ? <Badge tone="gold">פרימיום</Badge> : <Badge tone="green">חינמי</Badge>}
        </div>
        <h1 className="mt-3 text-3xl font-black text-navy">{course.title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-muted">{course.description}</p>
      </div>
      {units.map((unit) => (
        <section key={unit.id} className="card p-5">
          <h2 className="font-bold">{unit.title}</h2>
          <div className="mt-3 space-y-2">
            {lessons
              .filter((lesson) => lesson.unitId === unit.id)
              .map((lesson) => (
                <Link key={lesson.id} href={`/app/lesson/${lesson.id}`} className="block rounded-xl bg-canvas px-4 py-3 hover:bg-brand-soft">
                  <p className="font-semibold">{lesson.title}</p>
                  <p className="ltr-en text-xs text-muted">{lesson.summary}</p>
                </Link>
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}
