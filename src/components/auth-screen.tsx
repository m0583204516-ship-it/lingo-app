import { Logo } from "./shell";

export function AuthScreen({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen place-items-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>
        <div className="card p-6 md:p-8">{children}</div>
      </div>
    </div>
  );
}
