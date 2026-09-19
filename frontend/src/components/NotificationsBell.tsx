'use client';
import React, { useState } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/lib/useNotifications';
import { TYPE_META, timeAgo } from '@/lib/roleFeed';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Role-aware notification bell: badge + dropdown feed filtered to the
// signed-in user's role (live API, demo fallback offline).
export default function NotificationsBell() {
  const { user, demoMode } = useAuth();
  const { items, unread, demo, role, markRead, markAllRead } = useNotifications(user?.role, demoMode);
  const [open, setOpen] = useState(false);
  if (!user) return null;

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        aria-label={`Notifications${unread ? `, ${unread} unread` : ''}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="h-9 w-9 rounded-full relative text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white dark:hover:bg-white/10"
      >
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-orange-500 text-white text-[10px] font-bold grid place-items-center ring-2 ring-white dark:ring-[#0B0F1A]">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </Button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div role="menu" aria-label="Notifications" className="absolute right-0 top-full mt-2 w-[340px] max-w-[calc(100vw-2rem)] rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#111827] shadow-xl z-50 overflow-hidden animate-scale-in">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-white/[0.06]">
              <p className="text-sm font-bold capitalize">{role} alerts {demo && <span className="ml-1 text-[10px] font-semibold text-amber-600 dark:text-amber-400">demo</span>}</p>
              {unread > 0 && (
                <button onClick={markAllRead} className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                  <CheckCheck className="h-3.5 w-3.5" /> Mark all read
                </button>
              )}
            </div>
            <div className="max-h-[380px] overflow-y-auto overscroll-contain">
              {items.length === 0 && (
                <p className="px-4 py-8 text-center text-sm text-slate-500">No alerts for your role yet.</p>
              )}
              {items.map((n) => (
                <button
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  className={cn('flex w-full gap-3 px-4 py-3 text-left border-b border-slate-100 dark:border-white/[0.04] last:border-0 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors', !n.read && 'bg-indigo-50/50 dark:bg-indigo-950/20')}
                >
                  <span className={cn('mt-1 h-2 w-2 rounded-full shrink-0', n.read ? 'bg-slate-300 dark:bg-slate-600' : 'bg-orange-500')} />
                  <span className="min-w-0">
                    <span className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">{TYPE_META[n.type]?.label || n.type}</span>
                      <span className="text-[11px] text-slate-400">{timeAgo(n.createdAt)}</span>
                    </span>
                    <span className="block text-[13px] font-semibold text-slate-900 dark:text-white truncate">{n.title}</span>
                    <span className="block text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{n.message}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
