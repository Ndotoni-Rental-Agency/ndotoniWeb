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
    'Ndotoni – Makazi ya Wanachuo Karibu na Vyuo Tanzania | Student Housing',
  description:
    'Pata nyumba na vyumba vya bei nafuu kwa wanachuo karibu na vyuo vikuu Tanzania. Imetengenezwa kwa wanaoanza chuo na wanaoendelea. / Find affordable student housing near universities in Tanzania.',

  keywords: [
    'makazi ya wanachuo',
    'vyumba vya wanachuo',
    'nyumba karibu na chuo',
    'student housing Tanzania',
    'student accommodation Tanzania',
    'vyumba karibu na vyuo',
    'nyumba za kupanga wanachuo',
    'Dar es Salaam student housing',
  ],

  openGraph: {
    title: 'Ndotoni – Makazi ya Wanachuo Karibu na Vyuo Tanzania',
    description:
      'Pata makazi salama na ya bei nafuu kwa wanachuo karibu na vyuo vikuu Tanzania.',
    url: 'https://www.ndotoni.com',
    siteName: 'Ndotoni',
    images: [
      {
        url: 'https://d3qiuw9agheakm.cloudfront.net/image/28214330-80c1-7048-64a8-0e745f9e5c39/dgyZmIWNX3kA-hero3.jpg',
        width: 1200,
        height: 630,
        alt: 'Ndotoni – Makazi ya Wanachuo Tanzania',
      },
    ],
    locale: 'sw_TZ',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Ndotoni – Makazi ya Wanachuo Tanzania',
    description:
      'Vyumba na nyumba kwa wanachuo karibu na vyuo vikuu Tanzania.',
    images: [
      'https://d3qiuw9agheakm.cloudfront.net/image/28214330-80c1-7048-64a8-0e745f9e5c39/dgyZmIWNX3kA-hero3.jpg',
    ],
  },

  alternates: {
    canonical: 'https://www.ndotoni.com',
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
      </head>

      <body
        className={`${plusJakartaSans.variable} font-sans bg-white dark:bg-gray-900 transition-colors`}
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
