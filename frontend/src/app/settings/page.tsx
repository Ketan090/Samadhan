'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FlaskConical, ShieldCheck, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ROLE_DASHBOARD } from '@/components/RequireRole';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Settings — account, role dashboard shortcut, and the Demo Mode toggle.
// Demo ON (default): classic demo experience — demo datasets and offline
// fallbacks, exactly the current setup. Demo OFF: real backend data only;
// failed requests show empty states, never demo content.
export default function SettingsPage() {
  const { user, demoMode, setDemoMode, logout } = useAuth();
  const dash = (user?.role && ROLE_DASHBOARD[user.role]) || '/challenges';

  return (
    <div className="min-h-screen bg-white dark:bg-[#070A12]">
      <div className="container py-10 max-w-2xl">
        <Link href={dash} className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to dashboard
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1 mb-8">Account, role access and demo preferences.</p>

        <section className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.04] p-5 mb-4">
          <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white mb-3">
            <UserIcon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" /> Account
          </h2>
          {user ? (
            <div className="text-sm space-y-1">
              <p className="font-semibold text-slate-900 dark:text-white">{user.name}</p>
              <p className="text-slate-500">{user.email}</p>
              <p className="text-slate-500">Role: <span className="font-semibold capitalize text-slate-700 dark:text-slate-200">{user.role}</span></p>
              <Link href={dash} className="inline-block mt-2 text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">Open my {user.role} dashboard →</Link>
            </div>
          ) : (
            <p className="text-sm text-slate-500">You are not signed in. <Link href="/auth/login" className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline">Sign in →</Link></p>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.04] p-5 mb-4">
          <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white mb-2">
            <FlaskConical className="h-4 w-4 text-amber-600 dark:text-amber-400" /> Demo Mode
          </h2>
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {demoMode
                ? 'ON — demo datasets and offline fallbacks are shown when the server is unreachable.'
                : 'OFF — real backend data only. Unreachable requests show empty states, no demo content.'}
            </p>
            <button
              role="switch"
              aria-checked={demoMode}
              aria-label="Demo mode"
              onClick={() => setDemoMode(!demoMode)}
              className={cn('relative h-7 w-12 rounded-full transition-colors shrink-0', demoMode ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600')}
            >
              <span className={cn('absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all', demoMode ? 'left-6' : 'left-1')} />
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.04] p-5">
          <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white mb-2">
            <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> Role access
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Dashboards and alerts follow your role: citizen and expert use Explore, government / university / industry each have their own portal, admin has the system dashboard. Other roles are redirected automatically.
          </p>
          {user && (
            <Button variant="ghost" size="sm" onClick={logout} className="mt-3 text-red-600">Sign out</Button>
          )}
        </section>
      </div>
    </div>
  );
}
