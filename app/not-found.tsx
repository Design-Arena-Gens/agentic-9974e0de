import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-slate-100">
      <h1 className="text-3xl font-semibold text-white">صفحه پیدا نشد</h1>
      <p className="mt-4 text-sm text-slate-400">آدرس مورد نظر در دسترس نیست.</p>
      <Link href="/" className="mt-6 rounded-full border border-primary-500/60 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-primary-100">
        بازگشت به داشبورد
      </Link>
    </div>
  );
}
