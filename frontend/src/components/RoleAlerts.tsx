'use client';
import React from 'react';
import { BellRing, CheckCheck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/lib/useNotifications';
import { TYPE_META, timeAgo } from '@/lib/roleFeed';
import { cn } from '@/lib/utils';

// Role-aware alerts panel for dashboards: same feed as the navbar bell,
// rendered inline. Shows only the signed-in role's notification types.
export default function RoleAlerts({ limit = 5 }: { limit?: number }) {
  const { user, demoMode } = useAuth();
  const { items, unread, demo, role, markRead, markAllRead, loading } = useNotifications(user?.role, demoMode);
  if (!user) return null;
  const shown = items.slice(0, limit);
  const offline = !loading && !demo && items.length === 0;

  return (
    <section aria-label={`${role} alerts`} className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.04] p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="flex items-center gap-2 text-sm font-bold capitalize text-slate-900 dark:text-white">
          <BellRing className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          {role} alerts
          {unread > 0 && (
            <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-orange-500 text-white text-[11px] font-bold grid place-items-center">{unread}</span>
          )}
          {demo && <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400">demo</span>}
        </h2>
        {unread > 0 && (
          <button onClick={markAllRead} className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
            <CheckCheck className="h-3.5 w-3.5" /> Mark all read
          </button>
        )}
      </div>
      {loading && <p className="text-sm text-slate-500 py-4 text-center">Loading alerts…</p>}
      {!loading && shown.length === 0 && (
        <p className="text-sm text-slate-500 py-4 text-center">
          {offline ? 'Could not reach the server — alerts will appear here when back online.' : 'No alerts for your role yet.'}
        </p>
      )}
      <ul className="space-y-2">
        {shown.map((n) => (
          <li key={n.id}>
            <button
              onClick={() => markRead(n.id)}
              className={cn('flex w-full gap-3 rounded-xl px-3 py-2.5 text-left border transition-colors', n.read ? 'border-slate-100 dark:border-white/[0.05]' : 'border-indigo-200 dark:border-indigo-500/30 bg-indigo-50/50 dark:bg-indigo-950/20 hover:bg-indigo-50 dark:hover:bg-indigo-950/30')}
            >
              <span className={cn('mt-1.5 h-2 w-2 rounded-full shrink-0', n.read ? 'bg-slate-300 dark:bg-slate-600' : 'bg-orange-500')} />
              <span className="min-w-0">
                <span className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">{TYPE_META[n.type]?.label || n.type}</span>
                  <span className="text-[11px] text-slate-400">{timeAgo(n.createdAt)}</span>
                </span>
                <span className="block text-[13px] font-semibold text-slate-900 dark:text-white">{n.title}</span>
                <span className="block text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{n.message}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
