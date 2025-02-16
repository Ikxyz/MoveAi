import '@/styles/tailwind.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s | MoveAi',
    default: 'MoveAi - Your Smart Contract Co-Pilot.',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/css?f%5B%5D=switzer@400,500,600,700&amp;display=swap"
        />
        <link

          title="MoveAi - Everything move and movement blockchain"
          href="#"
        />
      </head>
      <body className="antialiased">
        <main>{children}</main>
      </body>
    </html>
  )
}
