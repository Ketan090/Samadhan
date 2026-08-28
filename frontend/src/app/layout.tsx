import type { Metadata, Viewport } from 'next'
import { Inter, Plus_Jakarta_Sans, Fraunces } from 'next/font/google'
import './globals.css'
import ClientProviders from '@/components/ClientProviders'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap', preload: false, fallback: ['system-ui','sans-serif'], adjustFontFallback: false })
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta', display: 'swap', preload: false, fallback: ['system-ui','sans-serif'], adjustFontFallback: false })
const display = Fraunces({ subsets: ['latin'], variable: '--font-display', display: 'swap', weight: ['600','700','800'], preload: false, fallback: ['serif'], adjustFontFallback: false })

export const metadata: Metadata = {
  title: { default: 'SamadhanHub — Real Problems. Collective Intelligence.', template: '%s · SamadhanHub' },
  description: 'A national platform to crowdsource societal challenges and facilitate collaborative problem solving through universities and industry partnerships across India.',
  keywords: ['samadhan','challenges','india','university','industry','government','collaboration','social impact'],
  authors: [{ name: 'SamadhanHub' }],
  openGraph: { title: 'SamadhanHub', description: 'Crowdsource challenges. Build solutions. Measure impact.', type: 'website' },
}
export const viewport: Viewport = { width: 'device-width', initialScale: 1, maximumScale: 5, themeColor: '#0f2440' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jakarta.variable} ${display.variable}`}>
      <head>
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('samadhanhub_theme');if(t==='dark')document.documentElement.classList.add('dark')}catch(e){}})();`}} />
      </head>
      <body className={`${jakarta.className} antialiased`}>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  )
}
