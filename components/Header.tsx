'use client';

import Link from 'next/link';

export function Header() {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-500 text-lg font-semibold text-white shadow-lg shadow-primary-500/30">
            PA
          </div>
          <div>
            <h1 className="text-lg font-semibold">Phone Analyst Bot</h1>
            <p className="text-xs text-slate-400">Real-time comparison across Iran&apos;s top retailers</p>
          </div>
        </div>
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-300 md:flex">
          <Link href="#dashboard" className="transition hover:text-white">
            Dashboard
          </Link>
          <Link href="#telegram" className="transition hover:text-white">
            Telegram Bot
          </Link>
          <Link href="#automation" className="transition hover:text-white">
            Automation
          </Link>
          <a
            href="https://core.telegram.org/bots"
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-slate-700 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-slate-200 transition hover:border-primary-500 hover:text-white"
          >
            Docs ↗
          </a>
        </nav>
      </div>
    </header>
  );
}
