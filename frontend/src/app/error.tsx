'use client';
import React from 'react';
import Link from 'next/link';

// Route-level safety net: any client-side render exception shows this
// recoverable card instead of Next's dead "Application error" page.
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen grid place-items-center bg-white dark:bg-[#070A12] p-6">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F1420] p-8 text-center shadow-sm">
        <div className="h-12 w-12 rounded-2xl bg-amber-500 text-white grid place-items-center mx-auto text-xl font-bold">!</div>
        <h1 className="text-xl font-bold mt-4 text-slate-900 dark:text-white">Something went wrong</h1>
        <p className="text-sm text-slate-500 mt-1">The page hit an unexpected error. Your data is safe.</p>
        {error?.message && (
          <p className="mt-3 rounded-xl bg-slate-100 dark:bg-white/5 px-3 py-2 text-xs text-slate-500 break-words">{error.message}</p>
        )}
        {!!error?.stack && (
          <details className="mt-3 text-left">
            <summary className="text-xs text-slate-400 cursor-pointer">Technical details (screenshot this)</summary>
            <pre className="mt-2 max-h-40 overflow-auto rounded-xl bg-slate-950 text-[10px] leading-relaxed text-slate-300 p-3 whitespace-pre-wrap break-words">{String(error.stack).slice(0, 1500)}</pre>
          </details>
        )}
        <div className="flex gap-2 mt-6">
          <button onClick={() => reset()} className="flex-1 h-10 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-sm font-semibold">
            Try again
          </button>
          <Link href="/" className="flex-1 h-10 rounded-full border border-slate-200 dark:border-white/10 grid place-items-center text-sm font-semibold">
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
