'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, ArrowRight, Shield, Building2, GraduationCap, Users, Landmark, CheckCircle2 } from 'lucide-react';

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
      const userData = await login(email, password);
      // Redirect to role-based dashboard
      const user = JSON.parse(localStorage.getItem('samadhanhub_user') || '{}');
      const roleRoutes: Record<string, string> = {
        admin: '/admin',
        government: '/government',
        university: '/university',
        industry: '/industry',
        citizen: '/challenges',
        expert: '/challenges',
      };
      router.push(roleRoutes[user.role] || '/');
    } catch {
      setError('Invalid credentials. Try a demo account below.');
    }
    setLoading(false);
  };

  const demoAccounts = [
    { label: 'Admin', email: 'admin@samadhanhub.gov.in', password: 'admin123', icon: Shield, color: 'bg-slate-100 dark:bg-slate-800', iconColor: 'text-slate-600 dark:text-slate-400', name: 'Dr. Rajesh Kumar' },
    { label: 'Government', email: 'government@samadhanhub.gov.in', password: 'government123', icon: Landmark, color: 'bg-rose-50 dark:bg-rose-950/30', iconColor: 'text-rose-600 dark:text-rose-400', name: 'Shri Amit Singh, IAS' },
    { label: 'University', email: 'university@samadhanhub.gov.in', password: 'university123', icon: GraduationCap, color: 'bg-emerald-50 dark:bg-emerald-950/30', iconColor: 'text-emerald-600 dark:text-emerald-400', name: 'Prof. Anita Desai' },
    { label: 'Industry', email: 'industry@samadhanhub.gov.in', password: 'industry123', icon: Building2, color: 'bg-indigo-50 dark:bg-indigo-950/30', iconColor: 'text-indigo-600 dark:text-indigo-400', name: 'Vikram Mehta' },
    { label: 'Citizen', email: 'citizen@samadhanhub.gov.in', password: 'citizen123', icon: Users, color: 'bg-amber-50 dark:bg-amber-950/30', iconColor: 'text-amber-600 dark:text-amber-400', name: 'Priya Sharma' },
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
              Click any account to autofill. Each role has a unique password shown below.
            </p>
            <div className="space-y-1.5">
              {demoAccounts.map(acc => {
                const Icon = acc.icon;
                return (
                  <button
                    key={acc.email}
                    onClick={() => { setEmail(acc.email); setPassword(acc.password); }}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border border-transparent hover:border-amber-200 dark:hover:border-amber-800/30 ${acc.color} hover:shadow-sm transition-all duration-150 text-left`}
                  >
                    <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${acc.color} ${acc.iconColor}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold">{acc.name}</div>
                      <div className="text-[10px] text-muted-foreground truncate">{acc.email}</div>
                    </div>
                    <Badge variant="outline" className="text-[10px] shrink-0">{acc.label}</Badge>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
