import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'ListingWriterAI - Generate Perfect Property Listings in 60 Seconds',
  description: 'AI-powered property description generator for real estate agents. Create professional listings instantly with our advanced AI technology.',
  keywords: 'real estate, property listings, AI, property descriptions, real estate marketing',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
          {children}
        </div>
      </body>
    </html>
  )
}