import { redirect } from "next/navigation";
import { AppShell } from "@/components/shell";
import { getCurrentUser } from "@/lib/session";

export default async function LearnerLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (!user.onboarded && user.role === "learner") redirect("/onboarding");
  return <AppShell user={user}>{children}</AppShell>;
}
