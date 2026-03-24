import './globals.css';
import type { ReactNode } from 'react';
import Script from 'next/script';

export const metadata = {
  title: 'Zipora Downloads – Fast App, Software and File Downloads',
  description:
    'Discover and download APKs, EXEs, ZIPs, PDFs and more with a clean interface.',
  other: {
    monetag: 'cd76fadb010bf0bacf74e000aec660b7',
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

        {/* Monetag Scripts */}

        <Script
          src="https://5gvci.com/act/files/tag.min.js?z=10780556"
          strategy="afterInteractive"
          async
        />

        <Script id="monetag-2" strategy="afterInteractive">
          {`
            (function(s){
              s.dataset.zone='10780566',
              s.src='https://nap5k.com/tag.min.js'
            })([document.documentElement, document.body]
            .filter(Boolean)
            .pop()
            .appendChild(document.createElement('script')));
          `}
        </Script>

        <Script id="monetag-3" strategy="afterInteractive">
          {`
            (function(s){
              s.dataset.zone='10780568',
              s.src='https://izcle.com/vignette.min.js'
            })([document.documentElement, document.body]
            .filter(Boolean)
            .pop()
            .appendChild(document.createElement('script')));
          `}
        </Script>

      </body>
    </html>
  );
}
