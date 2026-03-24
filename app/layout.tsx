import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Zipora Downloads – Cracked Apps, Software and File Downloads',
  description:
    'Discover and download Cracked APKs, EXEs, ZIPs, PDFs and more with a clean interface and organised categories.',
  other: {
    monetag: 'cd76fadb010bf0bacf74e000aec660b7',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="bg-slate-950 text-white">
      <head>
        {/* Monetag Verification (backup method) */}
        <meta name="monetag" content="cd76fadb010bf0bacf74e000aec660b7" />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
        }
