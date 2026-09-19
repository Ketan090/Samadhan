'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { notificationsAPI } from '@/lib/api';
import { DEMO_NOTIFICATIONS, FeedItem, Role } from '@/lib/roleFeed';

// Shared role-notification feed: live API first. The per-role demo fallback
// only applies when demoAllowed (Settings → Demo Mode); in real mode a dead
// backend surfaces as an empty list, never demo content.
export function useNotifications(role: string | undefined, demoAllowed = true) {
  const r = (ROLE_LIST.includes(role as Role) ? role : 'citizen') as Role;
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [demo, setDemo] = useState(false);
  const timer = useRef<any>(null);

  const refresh = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await notificationsAPI.list();
      const list = (res.data?.notifications || []) as FeedItem[];
      setItems(list);
      setDemo(false);
    } catch {
      if (demoAllowed) {
        setItems(DEMO_NOTIFICATIONS[r]);
        setDemo(true);
      } else {
        setItems([]);
        setDemo(false);
      }
    } finally {
      setLoading(false);
    }
  }, [r, demoAllowed]);

  useEffect(() => {
    refresh();
    // Gentle polling: every 2 min, paused while the tab is hidden — keeps
    // the shared API budget (and the backend rate limiter) quiet.
    timer.current = setInterval(() => {
      if (typeof document === 'undefined' || document.visibilityState === 'visible') refresh(true);
    }, 120000);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [refresh]);

  const unread = items.filter((i) => !i.read).length;

  const markRead = useCallback(async (id: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, read: true } : i)));
    try { await notificationsAPI.markRead(id); } catch { /* demo: local only */ }
  }, []);

  const markAllRead = useCallback(async () => {
    setItems((prev) => prev.map((i) => ({ ...i, read: true })));
    try { await notificationsAPI.markAllRead(); } catch { /* demo: local only */ }
  }, []);

  return { items, unread, loading, demo, role: r, refresh, markRead, markAllRead };
}

const ROLE_LIST = ['citizen', 'university', 'industry', 'government', 'expert', 'admin'];
