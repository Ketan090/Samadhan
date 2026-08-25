'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      router.push('/');
    } catch {
      setError('Invalid credentials. Try a demo account below.');
    }
    setLoading(false);
  };

  const demoAccounts = [
    { label: 'Admin', email: 'admin@samadhanhub.gov.in', role: 'admin', color: 'bg-slate-100 dark:bg-slate-800' },
    { label: 'Government', email: 'priya.sharma@gov.in', role: 'government', color: 'bg-rose-50 dark:bg-rose-950/30' },
    { label: 'University', email: 'amit.verma@iitb.ac.in', role: 'university', color: 'bg-emerald-50 dark:bg-emerald-950/30' },
    { label: 'Industry', email: 'vikram.patel@techcorp.in', role: 'industry', color: 'bg-indigo-50 dark:bg-indigo-950/30' },
    { label: 'Expert', email: 'meena.joshi@earthwatch.org', role: 'expert', color: 'bg-violet-50 dark:bg-violet-950/30' },
    { label: 'Citizen', email: 'citizen1@gmail.com', role: 'citizen', color: 'bg-amber-50 dark:bg-amber-950/30' },
  ];

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Logo + Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-lg shadow-sm">
              S
            </div>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-muted-foreground mt-1.5 text-sm">Sign in to SamadhanHub</p>
        </div>

        {/* Login Card */}
        <Card className="border-0 shadow-elevated">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 text-sm p-3 rounded-lg border border-red-200 dark:border-red-800/30">
                  {error}
                </div>
              )}
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Email</label>
                <Input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required className="h-11" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Password</label>
                <div className="relative">
                  <Input type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required className="h-11 pr-10" />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full h-11 gradient-primary font-semibold" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
                {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </form>
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link href="/challenges/submit" className="text-primary hover:underline font-medium">Submit a Challenge</Link>
            </div>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <Card className="mt-6 border-amber-200 dark:border-amber-800/30 bg-amber-50/50 dark:bg-amber-950/10">
          <CardHeader className="pb-2 pt-4 px-5">
            <CardTitle className="text-sm font-semibold text-amber-800 dark:text-amber-400 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              Demo Accounts
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 pb-4 px-5">
            <p className="text-xs text-amber-700 dark:text-amber-500/80 mb-3">
              Password for all accounts: <code className="bg-amber-100 dark:bg-amber-900/30 px-1.5 py-0.5 rounded text-[11px] font-mono">password123</code>
            </p>
            <div className="grid grid-cols-2 gap-1.5">
              {demoAccounts.map(acc => (
                <button
                  key={acc.email}
                  onClick={() => { setEmail(acc.email); setPassword('password123'); }}
                  className={`text-left p-2.5 rounded-lg border border-transparent hover:border-amber-200 dark:hover:border-amber-800/30 ${acc.color} hover:shadow-sm transition-all duration-150`}
                >
                  <div className="text-xs font-semibold">{acc.label}</div>
                  <div className="text-[10px] text-muted-foreground truncate mt-0.5">{acc.email}</div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
