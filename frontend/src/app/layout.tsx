import type { Metadata, Viewport } from 'next'
import { Inter, Plus_Jakarta_Sans, Fraunces } from 'next/font/google'
import './globals.css'
import ClientProviders from '@/components/ClientProviders'

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta', display: 'swap', preload: true, fallback: ['system-ui','sans-serif'], adjustFontFallback: true })

export const metadata: Metadata = {
  metadataBase: new URL('https://samadhan-for-us.vercel.app'),
  title: { default: 'SamadhanHub — Real Problems. Collective Intelligence.', template: '%s · SamadhanHub' },
  description: 'A national platform to crowdsource societal challenges and facilitate collaborative problem solving through universities and industry partnerships across India.',
  keywords: ['samadhan','challenges','india','university','industry','government','collaboration','social impact'],
  authors: [{ name: 'SamadhanHub' }],
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
  icons: { icon: '/favicon.ico' },
  openGraph: { title: 'SamadhanHub — Real Problems. Collective Intelligence.', description: 'Crowdsource challenges. Build solutions. Measure impact.', type: 'website', url: 'https://samadhan-for-us.vercel.app', siteName: 'SamadhanHub', locale: 'en_IN' },
  twitter: { card: 'summary_large_image', title: 'SamadhanHub', description: 'Crowdsource challenges. Build solutions. Measure impact.' },
}
export const viewport: Viewport = { width: 'device-width', initialScale: 1, maximumScale: 5, themeColor: [{ media: '(prefers-color-scheme: light)', color: '#ffffff' }, { media: '(prefers-color-scheme: dark)', color: '#070A12' }] }

import 'leaflet/dist/leaflet.css';
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${jakarta.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('samadhanhub_theme');if(t==='dark')document.documentElement.classList.add('dark')}catch(e){}})();`}} />
      </head>
      <body className={`${jakarta.className} antialiased`}>
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 z-[100] bg-slate-900 text-white px-3 py-1.5 rounded-full text-xs">Skip to content</a>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  )
}
