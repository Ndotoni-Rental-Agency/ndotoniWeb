import type { Metadata, Viewport } from 'next'
import { DM_Sans } from 'next/font/google'
import './globals.css'
import 'leaflet/dist/leaflet.css'
import { LayoutWrapper } from '@/components/layout'
import ClientProviders from '@/components/providers/ClientProviders'
import ErrorBoundary from '@/components/ui/ErrorBoundary'
import { Analytics } from '@vercel/analytics/next'

const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dm-sans',
  weight: ['200', '300', '400', '500', '600', '700', '800', '900'],
})

/**
 * SEO METADATA — WANACHUO FIRST
 */
export const metadata: Metadata = {
  title:
    'Ndotoni – Nyumba Zilizothibitishwa Tanzania | Verified Rentals & Property Management',
  description:
    'Pata nyumba zilizothibitishwa na picha halisi Tanzania. Tunatembelea, tunapiga picha, na kutangaza nyumba. Wapangaji wanapata makazi salama, wamiliki wanapata wapangaji haraka.',
  keywords: [
    'nyumba Tanzania',
    'nyumba zilizothibitishwa',
    'verified rentals Tanzania',
    'vyumba vya kukodisha',
    'makazi ya bei nafuu',
    'property management Tanzania',
    'kusimamia nyumba',
    'housing Tanzania',
    'apartments Tanzania',
    'rentals Tanzania',
    'nyumba karibu na shule',
    'kupata wapangaji',
    'landlord services Tanzania',
    'nyumba za kupanga',
  ],

  icons: {
    icon: [
      { url: '/favicon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },

  openGraph: {
    title: 'Ndotoni – Nyumba Zilizothibitishwa Tanzania',
    description:
      'Nyumba zilizothibitishwa na picha halisi. Tunasimamia nyumba za wamiliki bure na kuwasaidia wapangaji kupata makazi salama Tanzania.',
    url: 'https://www.ndotoni.com',
    siteName: 'Ndotoni',
    images: [
      {
        url: 'https://d3qiuw9agheakm5hall3gc6o5dx4.appsync-api.us-west-2.amazonaws.com/path-to-hero-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Ndotoni – Makazi Tanzania',
      },
    ],
    locale: 'sw_TZ',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Ndotoni – Nyumba Zilizothibitishwa Tanzania',
    description:
      'Nyumba zilizothibitishwa na picha halisi. Wamiliki wanapata wapangaji haraka, wapangaji wanapata makazi salama.',
    images: [
      'https://d3qiuw9agheakm5hall3gc6o5dx4.appsync-api.us-west-2.amazonaws.com/path-to-hero-image.jpg',
    ],
  },

  alternates: {
    canonical: 'https://www.ndotoni.com',
  },

  // Verification for Google Search Console (add your verification code if you have one)
  verification: {
    google: 'your-google-verification-code', // Replace with actual code from Search Console
  },
}

/**
 * VIEWPORT
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

/**
 * ROOT LAYOUT
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="sw" suppressHydrationWarning>
      <head>
        {/* API / CDN preconnects */}
        <link
          rel="preconnect"
          href="https://pkqm7izcm5gm5hall3gc6o5dx4.appsync-api.us-west-2.amazonaws.com"
        />
        <link
          rel="dns-prefetch"
          href="https://pkqm7izcm5gm5hall3gc6o5dx4.appsync-api.us-west-2.amazonaws.com"
        />
        <link
          rel="preconnect"
          href="https://images.unsplash.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://d2bstvyam1bm1f.cloudfront.net"
          crossOrigin="anonymous"
        />

        {/* Hero image preload */}
        <link
          rel="preload"
          as="image"
          href="https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=75&w=1200&auto=format&fit=crop"
          imageSrcSet="
            https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=75&w=640&auto=format&fit=crop 640w,
            https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=75&w=1200&auto=format&fit=crop 1200w
          "
          imageSizes="100vw"
        />
        <meta name="facebook-domain-verification" content="vhd487t40i0rq5h8lnl2zx8p5ckzwl" />
      </head>

      <body
        className={`${dmSans.variable} font-sans bg-white text-ink-900 dark:bg-gray-900 dark:text-gray-100 transition-colors`}
        suppressHydrationWarning
      >
        <ErrorBoundary>
          <ClientProviders>
            <LayoutWrapper>{children}</LayoutWrapper>
          </ClientProviders>
        </ErrorBoundary>

        <Analytics />
      </body>
    </html>
  )
}
