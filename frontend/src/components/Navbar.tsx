'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Globe, Menu, X, Sun, Moon, User, LogOut, ChevronDown, LayoutDashboard, Lightbulb, Map, Search, Bell, Command, Sparkles } from 'lucide-react';

const navLinks = [
  { href: '/challenges', label: 'Challenges', icon: Lightbulb },
  { href: '/challenges/map', label: 'Map', icon: Map },
  { href: '/collaborate', label: 'Collaborate', icon: Globe },
  { href: '/solutions', label: 'Solutions', icon: LayoutDashboard },
];
const portalLinks = [
  { href: '/university', label: 'University' },
  { href: '/industry', label: 'Industry' },
  { href: '/government', label: 'Government' },
  { href: '/impact', label: 'Impact' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [search, setSearch] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) router.push(`/search?q=${encodeURIComponent(search)}`);
  };

  return (
    <nav className="sticky top-0 z-50 w-full">
      <div className="h-[2px] w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808] opacity-80" />
      <div className="bg-white/80 dark:bg-[#0B0F1A]/80 backdrop-blur-2xl backdrop-saturate-150 border-b border-slate-200/60 dark:border-white/[0.06] supports-[backdrop-filter]:bg-white/70">
        <div className="container flex h-[64px] items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 group shrink-0 min-w-0">
              <div className="h-9 w-9 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center font-bold text-[15px] tracking-tight shadow-sm group-hover:shadow-md group-hover:-translate-y-[1px] transition-all shrink-0">S</div>
              <span className="text-[17px] font-bold tracking-tight text-slate-900 dark:text-white hidden sm:inline whitespace-nowrap shrink-0">SamadhanHub</span>
              <span className="hidden sm:inline-flex items-center rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-[10px] font-bold px-2 py-0.5 tracking-wide shrink-0">BETA</span>
            </Link>
            <div className="hidden lg:flex items-center gap-1 ml-2">
              {navLinks.map(link => {
                const Icon = link.icon;
                const active = pathname === link.href || pathname.startsWith(link.href + '/');
                return (
                  <Link key={link.href} href={link.href} className={cn("inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors", active ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/10")}>
                    <Icon className="h-3.5 w-3.5" />{link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSearch} role="search" aria-label="Site search" className="hidden md:flex items-center flex-1 max-w-[320px] lg:max-w-[420px] mx-2 lg:mx-4 min-w-0">
            <div className="relative w-full group">
              <Search aria-hidden="true" className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-slate-900 dark:group-focus-within:text-white transition-colors shrink-0" />
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search challenges..." aria-label="Search challenges" className="w-full h-9 pl-10 pr-4 xl:pr-[68px] rounded-full bg-slate-100 dark:bg-white/[0.06] border border-transparent hover:bg-white hover:border-slate-200 dark:hover:bg-white/[0.08] focus:bg-white dark:focus:bg-white/[0.1] focus:border-slate-200 dark:focus:border-white/15 text-[13px] placeholder:text-slate-400 placeholder:truncate focus:outline-none transition-all truncate" />
              <span className="absolute right-1.5 top-1/2 -translate-y-1/2 hidden xl:inline-flex items-center gap-1 rounded-full bg-white dark:bg-white/10 border border-slate-200 dark:border-white/10 px-2 py-1 text-[10px] font-medium text-slate-500 pointer-events-none"><Command className="h-3 w-3" />K</span>
            </div>
          </form>

          <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
            <Link href="/about" className="hidden xl:inline-flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 px-3 py-1.5 text-xs font-semibold hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 transition-colors whitespace-nowrap">Made by BharatBytes</Link>
            <Button variant="ghost" size="icon" aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'} className="h-9 w-9 rounded-full bg-slate-100 dark:bg-white/10 border border-slate-200/60 dark:border-white/10 text-slate-600 dark:text-amber-400 hover:text-slate-900 dark:hover:text-amber-300 hover:bg-white dark:hover:bg-white/15 shadow-sm" onClick={toggleTheme}>
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>
            {user ? (
              <>
                <Button variant="ghost" size="icon" aria-label="Notifications" className="h-9 w-9 rounded-full relative text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white dark:hover:bg-white/10"><Bell className="h-4 w-4" /><span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-orange-500 ring-2 ring-white dark:ring-[#0B0F1A]" /></Button>
                <div className="relative">
                  <button onClick={() => setUserMenuOpen(!userMenuOpen)} aria-haspopup="menu" aria-expanded={userMenuOpen} aria-label="User menu" className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/15 transition-colors">
                    <span className="h-7 w-7 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center text-xs font-bold">{user.name?.[0]?.toUpperCase()}</span>
                    <span className="hidden lg:block text-[13px] font-medium max-w-[110px] truncate">{user.name}</span>
                    <ChevronDown className={cn("h-3.5 w-3.5 text-slate-400 transition-transform", userMenuOpen && "rotate-180")} />
                  </button>
                  {userMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                      <div role="menu" className="absolute right-0 top-full mt-2 w-60 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#111827] shadow-xl p-1.5 z-50 animate-scale-in">
                        <div className="px-3 py-2.5 mb-1"><p className="text-sm font-semibold">{user.name}</p><p className="text-xs text-slate-500 capitalize">{user.role}</p></div>
                        {(() => { const roleMap: Record<string,string> = { citizen:'/challenges', expert:'/challenges', admin:'/admin', government:'/government', university:'/university', industry:'/industry' }; return <Link href={roleMap[user.role] || '/challenges'} onClick={()=>setUserMenuOpen(false)} role="menuitem" className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"><LayoutDashboard className="h-4 w-4" /> Dashboard</Link> })()}
                        <button role="menuitem" onClick={()=>{logout();setUserMenuOpen(false)}} className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 transition-colors"><LogOut className="h-4 w-4" /> Logout</button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/login"><Button variant="ghost" size="sm" className="h-9 rounded-full px-4 text-[13px] font-medium">Sign in</Button></Link>
                <Link href="/challenges/submit"><Button size="sm" className="h-9 rounded-full px-5 text-[13px] font-semibold bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 shadow-sm">Submit Challenge</Button></Link>
              </div>
            )}
            <Button variant="ghost" size="icon" aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'} aria-expanded={mobileMenuOpen} aria-controls="mobile-nav" className="lg:hidden h-10 w-10 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 shrink-0" onClick={()=>setMobileMenuOpen(!mobileMenuOpen)}>{mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</Button>
          </div>
        </div>

        <div className="hidden md:block border-t border-slate-100 dark:border-white/[0.04]">
          <div className="container flex items-center gap-1 h-[36px] overflow-x-auto">
            {portalLinks.map(l => {
              const active = pathname === l.href || pathname.startsWith(l.href + '/');
              return <Link key={l.href} href={l.href} className={cn("px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors", active ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white")}>{l.label}</Link>
            })}
            <span className="ml-auto hidden xl:inline-flex items-center gap-1.5 text-xs text-slate-400"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> {user ? `${user.role} mode` : '425K+ lives impacted · 156 challenges live'}</span>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <>
          <div className="fixed inset-0 top-[66px] bg-black/20 backdrop-blur-sm z-40 lg:hidden" onClick={()=>setMobileMenuOpen(false)} />
          <div id="mobile-nav" className="lg:hidden relative z-50 border-t border-slate-200 dark:border-white/10 bg-white dark:bg-[#0B0F1A] animate-slide-up max-h-[calc(100dvh-66px)] overflow-y-auto overscroll-contain">
            <div className="container py-4 space-y-1 pb-[calc(1rem+env(safe-area-inset-bottom))]">
              <form onSubmit={(e)=>{handleSearch(e); setMobileMenuOpen(false)}} role="search" aria-label="Mobile search" className="relative mb-3">
                <Search aria-hidden="true" className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search challenges, organizations..." aria-label="Search" className="w-full h-11 pl-10 pr-4 rounded-2xl bg-slate-100 dark:bg-white/10 border border-transparent text-sm focus:outline-none focus:bg-white dark:focus:bg-white/10 focus:border-slate-200 dark:text-white" />
              </form>
              {navLinks.map(link => {
                const Icon = link.icon;
                const active = pathname === link.href || pathname.startsWith(link.href + '/');
                return <Link key={link.href} href={link.href} onClick={()=>setMobileMenuOpen(false)} className={cn("flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium min-h-[44px]", active ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10")}><Icon className="h-4 w-4 shrink-0" />{link.label}</Link>
              })}
              <div className="pt-3 mt-2 border-t border-slate-200 dark:border-white/10">
                <p className="text-[11px] font-bold tracking-widest uppercase text-slate-400 mb-2 px-1">For partners</p>
                <div className="grid grid-cols-3 gap-2">{portalLinks.map(l=> <Link key={l.href} href={l.href} onClick={()=>setMobileMenuOpen(false)} className={cn("text-center py-3 rounded-xl text-xs font-semibold border min-h-[44px] grid place-items-center", pathname===l.href ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent" : "bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 border-transparent dark:border-white/5")}>{l.label}</Link>)}</div>
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
