"use client";
import Link from 'next/link';

/**
 * A simple navigation bar that stays at the top of the page.
 * Links are provided for main sections of the site.
 */
export default function NavBar() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-2xl font-black tracking-tight">
            <span className="rounded-2xl bg-gradient-to-r from-blue-500 to-violet-500 px-3 py-1 text-sm uppercase tracking-[0.2em]">Z</span>
            <Link href="/" className="hover:underline">
              Zipora
            </Link>
          </div>
          <p className="mt-1 text-xs text-slate-400">Apps, software, archives and digital files</p>
        </div>
        <nav className="hidden items-center gap-6 text-sm text-slate-300 md:flex">
          <Link href="/#downloads" className="transition hover:text-white">
            Downloads
          </Link>
          <Link href="/#formats" className="transition hover:text-white">
            Formats
          </Link>
          <Link href="/#fluxsave" className="transition hover:text-white">
            FluxSave
          </Link>
          <Link href="/#about" className="transition hover:text-white">
            About
          </Link>
          
        </nav>
      </div>
    </header>
  );
}
