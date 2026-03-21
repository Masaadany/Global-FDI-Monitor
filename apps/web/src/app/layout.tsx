import type { Metadata } from 'next'
import './globals.css'
import { Header } from '@/components/shared/Header'
import { Footer } from '@/components/shared/Footer'

export const metadata: Metadata = {
  title: 'FDI Monitor — Global Investment Intelligence',
  description: 'Real-time FDI intelligence across 215+ economies.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@600;700;800&display=swap"/>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='6' fill='%231A2C3E'/><text x='4' y='22' font-family='Arial' font-size='14' font-weight='900' fill='white'>FDI</text></svg>"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
      </head>
      <body style={{margin:0,padding:0,background:'#F8F9FA',color:'#1A2C3E',fontFamily:"'Inter','Helvetica Neue',sans-serif"}}>
        <div id="site-header"><Header/></div>
        <main>
          {children}
        </main>
        <div id="site-footer"><Footer/></div>
      </body>
    </html>
  )
}
