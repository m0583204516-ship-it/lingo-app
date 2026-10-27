import { redirect } from "next/navigation";
import { AppShell } from "@/components/shell";
import { getCurrentUser } from "@/lib/session";

export default async function ContentLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "content" && user.role !== "admin") redirect("/app/dashboard");
  return <AppShell user={user}>{children}</AppShell>;
}
