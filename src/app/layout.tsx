import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import 'leaflet/dist/leaflet.css';
import { LayoutWrapper } from '@/components/layout'
import ClientProviders from '@/components/providers/ClientProviders'
import ErrorBoundary from '@/components/ui/ErrorBoundary'

const plusJakartaSans = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta-sans',
  weight: ['200','300','400','500','600','700','800'],
})

// ✅ SEO Metadata for long-term & short-term rentals (English + Swahili)
export const metadata: Metadata = {
  title: 'Ndotoni – Long & Short Term Rentals / Nyumba za Muda Mrefu na Mfupi',
  description: 'Find affordable rooms, verified rental homes, and vacation stays across Tanzania. / Pata vyumba vya kukodisha, nyumba zilizothibitishwa, na makaazi ya likizo kote Tanzania.',
  openGraph: {
    title: 'Ndotoni – Long & Short Term Rentals / Nyumba za Muda Mrefu na Mfupi',
    description: 'Find affordable rooms, verified rental homes, and vacation stays across Tanzania. / Tafuta vyumba vya kukodisha, nyumba zilizothibitishwa, na makaazi ya likizo kote Tanzania.',
    url: 'https://www.ndotoni.com',
    siteName: 'Ndotoni',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=75&w=1200&auto=format&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Ndotoni – Rentals & Vacation Stays',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ndotoni – Long & Short Term Rentals / Nyumba za Muda Mrefu na Mfupi',
    description: 'Find affordable rooms, verified rental homes, and vacation stays across Tanzania. / Pata vyumba vya kukodisha, nyumba zilizothibitishwa, na makaazi ya likizo kote Tanzania.',
    images: ['https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=75&w=1200&auto=format&fit=crop'],
  },
}


export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect & preload */}
        <link rel="preconnect" href="https://pkqm7izcm5gm5hall3gc6o5dx4.appsync-api.us-west-2.amazonaws.com" />
        <link rel="dns-prefetch" href="https://pkqm7izcm5gm5hall3gc6o5dx4.appsync-api.us-west-2.amazonaws.com" />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://d2bstvyam1bm1f.cloudfront.net" crossOrigin="anonymous" />
        <link
          rel="preload"
          as="image"
          href="https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=75&w=1200&auto=format&fit=crop"
          imageSrcSet="https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=75&w=640&auto=format&fit=crop 640w, https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=75&w=1200&auto=format&fit=crop 1200w"
          imageSizes="100vw"
        />

        {/* Optional: fallback for older pages */}
        <title>Ndotoni – Find Your Next Home / Pata Nyumba Yako Ijayo</title>
        <meta name="description" content="Find affordable rooms and verified rental homes across Tanzania. / Pata vyumba vya kukodisha na nyumba zilizo hakikishiwa kote Tanzania." />
        <meta property="og:title" content="Ndotoni – Find Your Next Home / Pata Nyumba Yako Ijayo" />
        <meta property="og:description" content="Find affordable rooms and verified rental homes across Tanzania. / Pata vyumba vya kukodisha na nyumba zilizo hakikishiwa kote Tanzania." />
        <meta property="og:image" content="https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=75&w=1200&auto=format&fit=crop" />
        <meta property="og:url" content="https://www.ndotoni.com" />
        <meta name="twitter:card" content="summary_large_image" />
      </head>

      <body className={`${plusJakartaSans.variable} font-sans bg-white dark:bg-gray-900 transition-colors`}>
        <ErrorBoundary>
          <ClientProviders>
            <LayoutWrapper>{children}</LayoutWrapper>
          </ClientProviders>
        </ErrorBoundary>
      </body>
    </html>
  )
}
