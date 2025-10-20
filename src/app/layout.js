'use client';

import './globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>ListingWriterAI - AI-Powered Real Estate Listings</title>
        <meta name="description" content="Generate perfect property descriptions in 60 seconds with AI" />
      </head>
      <body>{children}</body>
    </html>
  )
}