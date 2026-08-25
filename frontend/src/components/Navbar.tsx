'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Globe, Menu, X, Sun, Moon, User, LogOut, ChevronDown,
  LayoutDashboard, Lightbulb, Map, Building2, GraduationCap,
  Factory, Shield, Search, Bell
} from 'lucide-react';

const navLinks = [
  { href: '/challenges', label: 'Challenges', icon: Lightbulb },
  { href: '/challenges/map', label: 'Map', icon: Map },
  { href: '/collaborate', label: 'Collaborate', icon: Globe },
  { href: '/solutions', label: 'Solutions', icon: LayoutDashboard },
  { href: '/impact', label: 'Impact', icon: Shield },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg">
            S
          </div>
          <span className="text-xl font-bold tracking-tight hidden sm:block">SamadhanHub</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <Link href="/search">
            <Button variant="ghost" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
          
          {user ? (
            <>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center">3</span>
              </Button>
              <div className="relative">
                <Button variant="ghost" size="sm" onClick={() => setUserMenuOpen(!userMenuOpen)} className="gap-2">
                  <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <span className="hidden lg:block text-sm">{user.name}</span>
                  <ChevronDown className="h-3 w-3" />
                </Button>
                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-56 rounded-md border bg-popover p-1 shadow-md z-50">
                      <div className="px-3 py-2 border-b">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                      </div>
                      <Link href={`/${user.role}`} className="flex items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-accent" onClick={() => setUserMenuOpen(false)}>
                        <LayoutDashboard className="h-4 w-4" /> Dashboard
                      </Link>
                      <button className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-accent text-red-600" onClick={() => { logout(); setUserMenuOpen(false); }}>
                        <LogOut className="h-4 w-4" /> Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link href="/challenges/submit">
                <Button size="sm" className="gradient-primary">Submit Challenge</Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container py-4 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-muted"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-2 border-t space-y-1">
              <Link href="/university" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>
                <GraduationCap className="h-4 w-4" /> University Portal
              </Link>
              <Link href="/industry" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>
                <Factory className="h-4 w-4" /> Industry Portal
              </Link>
              <Link href="/government" className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>
                <Shield className="h-4 w-4" /> Government Portal
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
