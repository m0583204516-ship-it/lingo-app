import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center px-4">
      <div className="card max-w-md p-8 text-center">
        <h1 className="text-2xl font-black text-navy">העמוד לא נמצא</h1>
        <p className="mt-2 text-sm text-muted">יכול להיות שהקישור ישן או שהתוכן עדיין בטיוטה.</p>
        <Link className="mt-5 inline-block font-bold text-brand" href="/">
          חזרה לדף הבית
        </Link>
      </div>
    </div>
  );
}
