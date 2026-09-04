'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, EyeOff, UserPlus, Loader2, AlertCircle } from 'lucide-react';

const roles = [
  { value: 'citizen', label: 'Citizen' },
  { value: 'university', label: 'University / Academic' },
  { value: 'industry', label: 'Industry / Company' },
  { value: 'government', label: 'Government' },
  { value: 'expert', label: 'Domain Expert' },
];

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('citizen');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) { setError('Please enter your name.'); return; }
    if (!email.trim()) { setError('Please enter your email.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    try {
      await register({ name: name.trim(), email: email.trim(), password, role });
      router.push('/');
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#070A12] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="h-12 w-12 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-bold text-lg shadow-sm group-hover:shadow-md group-hover:-translate-y-[1px] transition-all">S</div>
          </Link>
          <h1 className="text-2xl font-bold mt-4 text-gray-900 dark:text-white">Create your account</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Join SamadhanHub and help solve civic challenges</p>
        </div>

        <div className="rounded-[24px] border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F1420] p-6 sm:p-7 shadow-sm">
          {error && (
            <div className="mb-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 p-3 flex items-start gap-2 text-sm text-red-700 dark:text-red-400">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-900 dark:text-white">Full name</label>
              <Input
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Rahul Singh"
                className="mt-2 h-12 rounded-xl"
                autoComplete="name"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-900 dark:text-white">Email</label>
              <Input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-2 h-12 rounded-xl"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-900 dark:text-white">Password</label>
              <div className="relative mt-2">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="h-12 rounded-xl pr-10"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-900 dark:text-white">I am a</label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger className="mt-2 h-12 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {roles.map(r => (
                    <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-full bg-slate-900 dark:bg-white dark:text-slate-900 text-[15px] font-semibold disabled:opacity-50"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <UserPlus className="h-4 w-4 mr-2" />}
              Create account
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-slate-400 mt-5">
            Already have an account?{' '}
            <Link href="/auth/login" className="font-semibold text-violet-600 dark:text-violet-400 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
