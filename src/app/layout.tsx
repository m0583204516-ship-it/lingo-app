import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  variable: "--font-heebo",
});

export const metadata: Metadata = {
  title: "Lingo — פלטפורמה חכמה ללימוד אנגלית",
  description: "מסלול אישי, ספריית תוכן, מורה AI, משחקים ומעקב התקדמות במקום אחד.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="he" dir="rtl" className={`${heebo.variable} h-full antialiased`}>
      <body className={`${heebo.className} min-h-full bg-canvas font-sans text-ink`}>{children}</body>
    </html>
  );
}
