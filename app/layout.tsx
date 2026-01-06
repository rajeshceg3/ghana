import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ghana. Explore | Discover the Gem of West Africa',
  description: 'Explore the breathtaking landscapes, rich history, and vibrant culture of Ghana. Find your next destination.',
  keywords: ['Ghana', 'Travel', 'Tourism', 'Africa', 'Vacation', 'Map', 'Guide'],
  openGraph: {
    title: 'Ghana. Explore | Discover the Gem of West Africa',
    description: 'Curated selection of the most breathtaking locations in Ghana.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Ghana. Explore',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ghana. Explore',
    description: 'Discover the Gem of West Africa.',
  },
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  )
}
