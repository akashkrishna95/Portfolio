import type { Metadata, Viewport } from 'next'
import { Inter, Poppins, Space_Grotesk, Montserrat, Raleway } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-poppins',
  display: 'swap',
})

// Using Space Grotesk as a similar alternative to Garet
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-garet',
  display: 'swap',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-montserrat',
  display: 'swap',
})

const raleway = Raleway({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-raleway',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Akash Krishna U | Founder · Builder · Innovator',
  description: 'Building the Next-Gen Robotics for Agriculture, Defence, Forestry and Sustainability. Startup founder, embedded AI developer, and autonomous systems engineer.',
  keywords: ['robotics', 'agritech', 'startup', 'AI', 'embedded systems', 'Akash Krishna U', 'Agni Robotics'],
  authors: [{ name: 'Akash Krishna U' }],
  openGraph: {
    title: 'Akash Krishna U | Founder · Builder · Innovator',
    description: 'Building autonomous systems at the edge of what\'s possible.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable} ${spaceGrotesk.variable} ${montserrat.variable} ${raleway.variable}`}>
      <body className="font-sans antialiased bg-[#0a0a0a] text-white overflow-x-hidden">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
