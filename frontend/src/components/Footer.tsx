'use client';
import React from 'react';
import Link from 'next/link';
import { Globe, Twitter, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t bg-muted/20">
      <div className="container py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">S</div>
              <span className="text-lg font-bold tracking-tight">SamadhanHub</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Connecting communities, universities, and industries to transform societal challenges into scalable solutions.
            </p>
            <div className="flex gap-2">
              {[Globe, Twitter, Linkedin, Mail].map((Icon, i) => (
                <div key={i} className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 cursor-pointer transition-colors">
                  <Icon className="h-3.5 w-3.5" />
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            { title: 'Platform', links: [
              { label: 'Explore Challenges', href: '/challenges' },
              { label: 'Submit Challenge', href: '/challenges/submit' },
              { label: 'Collaboration Hub', href: '/collaborate' },
              { label: 'Impact Dashboard', href: '/impact' },
            ]},
            { title: 'Portals', links: [
              { label: 'University Portal', href: '/university' },
              { label: 'Industry Portal', href: '/industry' },
              { label: 'Government Portal', href: '/government' },
            ]},
            { title: 'Resources', links: [
              { label: 'Documentation', href: '#' },
              { label: 'API Reference', href: '#' },
              { label: 'Support', href: '#' },
              { label: 'Privacy Policy', href: '#' },
            ]},
          ].map((section) => (
            <div key={section.title} className="space-y-3">
              <h4 className="text-sm font-semibold">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © 2024 SamadhanHub. Empowering collaborative problem solving.
          </p>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500 text-[10px] px-2 py-0.5 font-medium">
              Demo Data
            </span>
            <span className="text-[11px] text-muted-foreground">
              All data shown is for demonstration purposes only.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
