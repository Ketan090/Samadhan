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
    'draft': 'bg-gray-100 text-gray-700',
    'submitted': 'bg-blue-100 text-blue-700',
    'verified': 'bg-green-100 text-green-700',
    'open': 'bg-emerald-100 text-emerald-700',
    'in-progress': 'bg-yellow-100 text-yellow-700',
    'solved': 'bg-purple-100 text-purple-700',
    'implemented': 'bg-green-100 text-green-700',
    'closed': 'bg-gray-100 text-gray-600',
    'pending': 'bg-orange-100 text-orange-700',
    'rejected': 'bg-red-100 text-red-700',
    'active': 'bg-blue-100 text-blue-700',
    'pilot': 'bg-indigo-100 text-indigo-700',
    'approved': 'bg-green-100 text-green-700',
    'under-review': 'bg-yellow-100 text-yellow-700',
    'draft-solution': 'bg-gray-100 text-gray-700'
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
}

export function getSeverityColor(severity: string): string {
  const colors: Record<string, string> = {
    'critical': 'bg-red-100 text-red-700 border-red-200',
    'high': 'bg-orange-100 text-orange-700 border-orange-200',
    'medium': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    'low': 'bg-green-100 text-green-700 border-green-200'
  };
  return colors[severity] || 'bg-gray-100 text-gray-700';
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
