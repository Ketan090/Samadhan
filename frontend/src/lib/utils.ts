import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    'draft': 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
    'submitted': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'verified': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    'open': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    'in-progress': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    'solved': 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400',
    'implemented': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    'closed': 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
    'pending': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    'rejected': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    'active': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'pilot': 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
    'approved': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    'under-review': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  };
  return colors[status] || 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
}

export function getSeverityColor(severity: string): string {
  const colors: Record<string, string> = {
    'critical': 'bg-red-100 text-red-700 border-transparent dark:bg-red-900/40 dark:text-red-400',
    'high': 'bg-orange-100 text-orange-700 border-transparent dark:bg-orange-900/40 dark:text-orange-400',
    'medium': 'bg-amber-100 text-amber-700 border-transparent dark:bg-amber-900/40 dark:text-amber-400',
    'low': 'bg-emerald-100 text-emerald-700 border-transparent dark:bg-emerald-900/40 dark:text-emerald-400'
  };
  return colors[severity] || 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-transparent dark:border-white/10';
}

export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    'Environment': '🌿',
    'Healthcare': '🏥',
    'Education': '📚',
    'Transportation': '🚌',
    'Agriculture': '🌾',
    'Infrastructure': '🏗️',
    'Social Welfare': '👥',
    'Technology': '💻'
  };
  return icons[category] || '📋';
}
