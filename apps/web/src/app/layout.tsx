import type { Metadata } from 'next'
import './globals.css'
import { Header } from '@/components/shared/Header'
import { Footer } from '@/components/shared/Footer'

export const metadata: Metadata = {
  title: 'Global FDI Monitor — Investment Intelligence Platform',
  description: 'Global investment intelligence. Real-time. Verified. Smart. GOSA-scored FDI intelligence across 215+ economies.',
  themeColor: '#2ECC71',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><circle cx='16' cy='16' r='14' stroke='%232ECC71' stroke-width='2' fill='none'/><circle cx='22' cy='10' r='4' fill='%232ECC71'/></svg>"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
      </head>
      <body className="bg-background-offwhite text-text-primary min-h-screen flex flex-col">
        <Header/>
        <main className="flex-1 pt-16">
          {children}
        </main>
        <Footer/>
      </body>
    </html>
  )
}
