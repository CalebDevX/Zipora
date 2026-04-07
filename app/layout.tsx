import './globals.css';
import type { ReactNode } from 'react';
import Script from 'next/script';

export const metadata = {
  title: 'Achek Zipora - Apps, Software and File Downloads',
  description:
    'Discover and download APKs, EXEs, ZIPs, PDFs and more with a clean interface.',
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="bg-slate-950 text-white">
      <head>
        <meta name="monetag" content="cd76fadb010bf0bacf74e000aec660b7" />
      </head>

      <body className="antialiased">
        {children}

        {/* 🔥 POPUNDER / ONCLICK ADS */}
        <Script
          src="https://pl28974290.profitablecpmratenetwork.com/14/c1/19/14c1196c555973ee0ccabf1a947ef139.js"
          strategy="afterInteractive"
        />

        <Script
          src="https://pl28974324.profitablecpmratenetwork.com/84/fc/29/84fc29951728fe1441899ffa701061b1.js"
          strategy="afterInteractive"
        />

        {/* 🔥 BANNER (AUTO CONTAINER) */}
        <Script
          src="https://pl28974291.profitablecpmratenetwork.com/a3b45e7b268818c756409a3268cece57/invoke.js"
          strategy="afterInteractive"
        />
        
        <div id="container-a3b45e7b268818c756409a3268cece57"></div>

        {/* 🔥 300x250 IFRAME BANNER */}
        <Script id="ad-options" strategy="afterInteractive">
          {`
            var atOptions = {
              key: 'c5aaf83badd7f4b369cf4d2497fdd48d',
              format: 'iframe',
              height: 250,
              width: 300,
              params: {}
            };
          `}
        </Script>

        <Script
          src="https://www.highperformanceformat.com/c5aaf83badd7f4b369cf4d2497fdd48d/invoke.js"
          strategy="afterInteractive"
        />

      </body>
    </html>
  );
}
