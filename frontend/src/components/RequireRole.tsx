'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

// Role → home dashboard (mirrors the navbar Dashboard link).
export const ROLE_DASHBOARD: Record<string, string> = {
  citizen: '/challenges',
  expert: '/challenges',
  admin: '/admin',
  government: '/government',
  university: '/university',
  industry: '/industry',
};

// Page-level gate: call unconditionally at the top of a dashboard component
// (after its other hooks), then `if (!gate.allowed) return standby` before
// the main return. Visitors without the role are sent to their own
// dashboard; logged-out visitors go to login. Works in demo and real mode.
export function useRequireRole(allowed: string[]) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const role = user?.role;
  const ok = !!user && !!role && allowed.includes(role);
  const key = allowed.join('|');
  useEffect(() => {
    if (loading) return;
    if (!user) router.replace('/auth/login');
    else if (role && !key.split('|').includes(role)) router.replace(ROLE_DASHBOARD[role] || '/challenges');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, role, loading, router, key]);
  return { allowed: ok, loading };
}

export function GateStandby() {
  return (
    <div className="min-h-screen grid place-items-center text-sm text-slate-500 dark:text-slate-400">
      Checking access…
    </div>
  );
}
