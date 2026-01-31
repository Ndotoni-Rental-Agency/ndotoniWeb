import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import 'leaflet/dist/leaflet.css';
import { LayoutWrapper } from '@/components/layout'
import ClientProviders from '@/components/providers/ClientProviders'
import ErrorBoundary from '@/components/ui/ErrorBoundary'
import { CacheIndicator } from '@/components/dev/CacheIndicator'

const plusJakartaSans = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta-sans',
  weight: ['200', '300', '400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  title: 'ndotoni - Property Management',
  description: 'Modern property management platform',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to critical domains */}
        <link rel="preconnect" href="https://pkqm7izcm5gm5hall3gc6o5dx4.appsync-api.us-west-2.amazonaws.com" />
        <link rel="dns-prefetch" href="https://pkqm7izcm5gm5hall3gc6o5dx4.appsync-api.us-west-2.amazonaws.com" />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://d2bstvyam1bm1f.cloudfront.net" crossOrigin="anonymous" />
        
        {/* Preload hero image for faster LCP */}
        <link
          rel="preload"
          as="image"
          href="https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=75&w=1200&auto=format&fit=crop"
          imageSrcSet="https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=75&w=640&auto=format&fit=crop 640w, https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=75&w=1200&auto=format&fit=crop 1200w"
          imageSizes="100vw"
        />
      </head>
      <body className={`${plusJakartaSans.variable} font-sans bg-white dark:bg-gray-900 transition-colors`}>
        <ErrorBoundary>
          <ClientProviders>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
          </ClientProviders>
        </ErrorBoundary>
        <CacheIndicator />
      </body>
    </html>
  )
}