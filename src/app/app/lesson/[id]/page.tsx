import { notFound, redirect } from "next/navigation";
import { LessonPlayer } from "@/components/lesson-player";
import { ACTIVITIES, LESSONS } from "@/lib/seed";
import { canAccessCourse } from "@/lib/learning";
import { getCurrentUser } from "@/lib/session";
import Link from "next/link";

export default async function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const { id } = await params;
  const lesson = LESSONS.find((item) => item.id === id);
  if (!lesson) notFound();
  if (!canAccessCourse(user, lesson.courseId)) {
    return (
      <div className="card p-8 text-center">
        <h1 className="text-xl font-black">השיעור בתוכנית Pro</h1>
        <Link className="mt-4 inline-block font-bold text-brand" href="/app/profile">
          שדרוג מנוי
        </Link>
      </div>
    );
  }
  const activities = ACTIVITIES.filter((item) => item.lessonId === lesson.id);

  return <LessonPlayer lessonTitle={lesson.title} summary={lesson.summary} activities={activities} />;
}
