import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import 'leaflet/dist/leaflet.css'
import { LayoutWrapper } from '@/components/layout'
import ClientProviders from '@/components/providers/ClientProviders'
import ErrorBoundary from '@/components/ui/ErrorBoundary'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta-sans',
  weight: ['200', '300', '400', '500', '600', '700', '800'],
})

/**
 * SEO METADATA — WANACHUO FIRST
 */
export const metadata: Metadata = {
  title:
    'Ndotoni – Pata Makazi Bora Karibu Na Wewe Tanzania | Housing & Rentals',
  description:
    'Pata nyumba, vyumba, na makazi salama na ya bei nafuu Tanzania. Kwa wanafunzi, wafanyakazi, na familia zinazotafuta makazi karibu na maeneo muhimu.',
  keywords: [
    'nyumba Tanzania',
    'vyumba vya kukodisha',
    'makazi ya bei nafuu',
    'housing Tanzania',
    'apartments Tanzania',
    'rentals Tanzania',
    'nyumba karibu na shule',
    'makazi kwa wanafunzi na familia',
    'nyumba za kupanga',
  ],

  // Icons for Google Search and browsers
  icons: {
    icon: [
      { url: '/icon?<generated>', sizes: '48x48', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon?<generated>', sizes: '180x180', type: 'image/png' },
    ],
  },

  openGraph: {
    title: 'Ndotoni – Makazi Bora Tanzania',
    description:
      'Pata makazi salama na ya bei nafuu kwa wanafunzi, wafanyakazi, na familia karibu na maeneo muhimu Tanzania.',
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
    title: 'Ndotoni – Makazi Bora Tanzania',
    description:
      'Pata nyumba, vyumba, na makazi kwa wanafunzi, wafanyakazi, na familia karibu na maeneo muhimu Tanzania.',
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
    <html lang="en" suppressHydrationWarning>
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
      </head>

      <body
        className={`${plusJakartaSans.variable} font-sans bg-white dark:bg-gray-900 transition-colors`}
        suppressHydrationWarning
      >
        <ErrorBoundary>
          <ClientProviders>
            <LayoutWrapper>{children}</LayoutWrapper>
          </ClientProviders>
        </ErrorBoundary>
      </body>
    </html>
  )
}
