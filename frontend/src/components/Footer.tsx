'use client';
import React from 'react';
import Link from 'next/link';
import { Globe, Github, Twitter, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">S</div>
              <span className="text-xl font-bold">SamadhanHub</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Connecting communities, universities, and industries to transform societal challenges into scalable solutions.
            </p>
            <div className="flex gap-3">
              <Globe className="h-4 w-4 text-muted-foreground hover:text-primary cursor-pointer" />
              <Twitter className="h-4 w-4 text-muted-foreground hover:text-primary cursor-pointer" />
              <Linkedin className="h-4 w-4 text-muted-foreground hover:text-primary cursor-pointer" />
              <Mail className="h-4 w-4 text-muted-foreground hover:text-primary cursor-pointer" />
            </div>
          </div>

          {/* Platform */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/challenges" className="hover:text-foreground transition-colors">Explore Challenges</Link></li>
              <li><Link href="/challenges/submit" className="hover:text-foreground transition-colors">Submit Challenge</Link></li>
              <li><Link href="/collaborate" className="hover:text-foreground transition-colors">Collaboration Hub</Link></li>
              <li><Link href="/impact" className="hover:text-foreground transition-colors">Impact Dashboard</Link></li>
            </ul>
          </div>

          {/* Portals */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Portals</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/university" className="hover:text-foreground transition-colors">University Portal</Link></li>
              <li><Link href="/industry" className="hover:text-foreground transition-colors">Industry Portal</Link></li>
              <li><Link href="/government" className="hover:text-foreground transition-colors">Government Portal</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-foreground transition-colors">Documentation</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">API Reference</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Support</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2024 SamadhanHub. Built for Smart India Hackathon.
          </p>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 font-medium">
              Demo Data
            </span>
            <span className="text-xs text-muted-foreground">
              All data shown is for demonstration purposes only.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
