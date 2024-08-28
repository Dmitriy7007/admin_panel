import type { Metadata } from 'next'
import { Fira_Mono } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import { Providers } from './Providers'
import './globals.scss'

const inter = Fira_Mono({ subsets: ['cyrillic', 'latin'], weight: '400' })

export const metadata: Metadata = {
  title: 'Admin panel',
  description: 'Admin panel',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
