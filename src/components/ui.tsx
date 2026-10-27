import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
}) {
  const styles = {
    primary: "bg-navy text-white hover:bg-[#172554]",
    secondary: "bg-white text-navy border border-line hover:bg-brand-soft",
    ghost: "bg-transparent text-navy hover:bg-brand-soft",
    danger: "bg-danger text-white hover:bg-red-800",
  }[variant];
  return (
    <button
      className={`focus-ring inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${styles} ${className}`}
      {...props}
    />
  );
}

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-semibold text-ink">{label}</span>
      {children}
      {hint ? <span className="block text-xs text-muted">{hint}</span> : null}
    </label>
  );
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className="focus-ring h-11 w-full rounded-xl border border-line bg-white px-3 text-sm text-ink placeholder:text-slate-400"
      {...props}
    />
  );
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className="focus-ring h-11 w-full rounded-xl border border-line bg-white px-3 text-sm text-ink"
      {...props}
    />
  );
}

export function Badge({
  children,
  tone = "blue",
}: {
  children: ReactNode;
  tone?: "blue" | "gold" | "green" | "slate";
}) {
  const styles = {
    blue: "bg-brand-soft text-navy",
    gold: "bg-amber-100 text-amber-800",
    green: "bg-emerald-100 text-emerald-800",
    slate: "bg-slate-100 text-slate-700",
  }[tone];
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${styles}`}>
      {children}
    </span>
  );
}

export function StateCard({
  title,
  body,
  children,
}: {
  title: string;
  body: string;
  children?: ReactNode;
}) {
  return (
    <div className="card p-8 text-center">
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">{body}</p>
      {children ? <div className="mt-5">{children}</div> : null}
    </div>
  );
}

export function ProgressBar({ value }: { value: number }) {
  const width = Math.max(0, Math.min(100, value));
  return (
    <div className="h-2.5 overflow-hidden rounded-full bg-slate-200" aria-valuenow={width} role="progressbar">
      <div className="h-full rounded-full bg-brand" style={{ width: `${width}%` }} />
    </div>
  );
}
