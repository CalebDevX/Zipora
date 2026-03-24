"use client";
import { useEffect, useState } from 'react';
import NavBar from '../../../components/NavBar';
import { Download } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

// Multiple Monetag links used for monetisation. We select one at random per download.
const monetagLinks = [
  'https://omg10.com/4/10753737',
  'https://omg10.com/4/10117202',
  'https://omg10.com/4/10656039',
];

export default function FileDetailPage({ params }: { params: { slug: string } }) {
  const [file, setFile] = useState<any | null>(null);

  useEffect(() => {
    const fetchFile = async () => {
      const { data, error } = await supabase
        .from('files')
        .select('*')
        .eq('slug', params.slug)
        .single();
      if (error) console.error(error);
      else setFile(data);
    };
    fetchFile();
  }, [params.slug]);

  const handleDownload = () => {
    if (!file) return;
    const randomIndex = Math.floor(Math.random() * monetagLinks.length);
    const monetagLink = monetagLinks[randomIndex];
    window.open(monetagLink, '_blank');
    setTimeout(() => {
      const link = document.createElement('a');
      link.href = file.file_url;
      link.target = '_self';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 800);
  };

  if (!file) {
    return (
      <main className="min-h-screen">
        <NavBar />
        <section className="mx-auto max-w-7xl px-6 py-16">
          <h1 className="text-3xl font-bold">File not found</h1>
          <p className="mt-4 text-slate-400">
            The file you are looking for does not exist. Return to the{' '}
            <a href="/" className="text-blue-500 underline">home page</a>.
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <NavBar />
      <section className="mx-auto max-w-4xl px-6 py-16">
        <div className="grid gap-8 md:grid-cols-[1fr_1fr] md:items-start">
          <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={file.image_url} alt={file.title} className="h-80 w-full object-cover" />
          </div>
          <div>
            <span className="inline-block rounded-full border border-white/20 bg-black/35 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
              {file.category}
            </span>
            <h1 className="mt-4 text-3xl font-bold leading-snug md:text-4xl">{file.title}</h1>
            <div className="mt-4 flex items-center gap-2 text-sm text-slate-300">
              <span className="rounded-full bg-white/5 px-3 py-1">{file.format}</span>
              <span className="rounded-full bg-white/5 px-3 py-1">{file.file_size}</span>
            </div>
            <p className="mt-6 text-base leading-7 text-slate-400">{file.description}</p>
            <button
              onClick={handleDownload}
              className="mt-8 flex w-full max-w-xs items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-950/30"
            >
              <Download className="h-4 w-4" />
              Download Now
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}