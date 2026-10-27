"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Bot,
  Gamepad2,
  Home,
  Library,
  LineChart,
  LogOut,
  Route,
  Shield,
  UserRound,
} from "lucide-react";
import { logoutAction } from "@/lib/actions";
import type { Role, User } from "@/lib/types";

const LEARNER_NAV = [
  { href: "/app/dashboard", label: "בית", icon: Home },
  { href: "/app/path", label: "המסלול", icon: Route },
  { href: "/app/library", label: "ספרייה", icon: Library },
  { href: "/app/tutor", label: "מורה AI", icon: Bot },
  { href: "/app/games", label: "משחקים", icon: Gamepad2 },
  { href: "/app/progress", label: "התקדמות", icon: LineChart },
  { href: "/app/profile", label: "פרופיל", icon: UserRound },
];

function navFor(role: Role) {
  if (role === "admin") {
    return [
      { href: "/admin", label: "ניהול", icon: Shield },
      { href: "/content", label: "תוכן", icon: BookOpen },
      { href: "/app/dashboard", label: "תצוגת לומדת", icon: Home },
    ];
  }
  if (role === "content") {
    return [
      { href: "/content", label: "התוכן שלי", icon: BookOpen },
      { href: "/app/library", label: "ספרייה", icon: Library },
    ];
  }
  return LEARNER_NAV;
}

export function Logo() {
  return (
    <Link href="/" className="focus-ring flex items-center gap-2 rounded-lg">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-navy text-sm font-black text-white">
        L
      </span>
      <span className="text-lg font-extrabold tracking-tight text-navy">Lingo</span>
    </Link>
  );
}

export function AppShell({ user, children }: { user: User; children: ReactNode }) {
  const pathname = usePathname();
  const items = navFor(user.role);
  const mobile = LEARNER_NAV.slice(0, 5);

  return (
    <div className="min-h-screen bg-canvas">
      <aside className="fixed inset-y-0 right-0 hidden w-64 border-l border-line bg-white p-5 lg:flex lg:flex-col">
        <Logo />
        <p className="mt-6 text-xs font-semibold tracking-wide text-slate-500">ניווט</p>
        <nav className="mt-2 flex flex-1 flex-col gap-1" aria-label="ניווט ראשי">
          {items.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`focus-ring flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold ${
                  active ? "bg-brand-soft text-navy" : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Icon size={18} aria-hidden />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <form action={logoutAction}>
          <button className="focus-ring flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-semibold text-slate-600 hover:bg-slate-50">
            <LogOut size={18} />
            יציאה
          </button>
        </form>
      </aside>

      <div className="lg:mr-64">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-line bg-white/90 px-4 py-3 backdrop-blur lg:px-8">
          <div className="lg:hidden">
            <Logo />
          </div>
          <div className="hidden text-sm text-muted lg:block">
            שלום {user.fullName.split(" ")[0]} · רמה {user.level}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="rounded-full bg-amber-50 px-3 py-1 font-semibold text-gold">{user.points} נק׳</span>
            <span className="rounded-full bg-brand-soft px-3 py-1 font-semibold text-navy">{user.streak} ימי רצף</span>
          </div>
        </header>
        <main className="px-4 py-6 pb-24 lg:px-8 lg:pb-10">{children}</main>
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-line bg-white px-1 py-1 lg:hidden"
        aria-label="ניווט תחתון"
      >
        {mobile.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`focus-ring flex min-h-12 flex-col items-center justify-center rounded-xl text-[11px] font-semibold ${
                active ? "text-navy" : "text-slate-500"
              }`}
            >
              <Icon size={20} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
