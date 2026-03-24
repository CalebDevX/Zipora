import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'Zipora Downloads – Fast App, Software and File Downloads',
  description: 'Discover and download APKs, EXEs, ZIPs, PDFs and more with a clean interface and organised categories.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="bg-slate-950 text-white">
      <body>{children}</body>
    </html>
  );
}