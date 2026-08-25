'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { LogIn, Eye, EyeOff } from 'lucide-react';

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
      setError('Invalid credentials. Try demo credentials below.');
    }
    setLoading(false);
  };

  const demoAccounts = [
    { label: 'Government', email: 'priya.sharma@gov.in', role: 'government' },
    { label: 'University', email: 'amit.verma@iitb.ac.in', role: 'university' },
    { label: 'Industry', email: 'vikram.patel@techcorp.in', role: 'industry' },
    { label: 'Expert', email: 'meena.joshi@earthwatch.org', role: 'expert' },
    { label: 'Citizen', email: 'citizen1@gmail.com', role: 'citizen' },
    { label: 'Admin', email: 'admin@samadhanhub.gov.in', role: 'admin' },
  ];

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-2xl mx-auto mb-4">S</div>
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-muted-foreground mt-1">Sign in to SamadhanHub</p>
        </div>

        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg">{error}</div>}
              <div>
                <label className="text-sm font-medium mb-1 block">Email</label>
                <Input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Password</label>
                <div className="relative">
                  <Input type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <Button type="submit" className="w-full gradient-primary" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Don&apos;t have an account? <Link href="/challenges/submit" className="text-primary hover:underline">Submit a Challenge</Link>
            </div>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <Card className="mt-6 border-yellow-200 bg-yellow-50/50">
          <CardHeader className="pb-2"><CardTitle className="text-sm text-yellow-800">Demo Credentials</CardTitle></CardHeader>
          <CardContent className="pt-0">
            <p className="text-xs text-yellow-700 mb-3">Password for all accounts: <code className="bg-yellow-100 px-1 rounded">password123</code></p>
            <div className="grid grid-cols-2 gap-2">
              {demoAccounts.map(acc => (
                <button
                  key={acc.email}
                  onClick={() => { setEmail(acc.email); setPassword('password123'); }}
                  className="text-left p-2 rounded border bg-white hover:bg-yellow-50 transition-colors"
                >
                  <div className="text-xs font-medium">{acc.label}</div>
                  <div className="text-[10px] text-muted-foreground truncate">{acc.email}</div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
