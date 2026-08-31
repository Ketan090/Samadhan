'use client';
import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { usePathname } from 'next/navigation';

function LayoutShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <Navbar />
      <main id="main" className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <LayoutShell>{children}</LayoutShell>
      </AuthProvider>
    </ThemeProvider>
  );
}
