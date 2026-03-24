"use client";
import { useState, useMemo, useEffect } from 'react';
import NavBar from '../../components/NavBar';
import FileCard from '../../components/FileCard';
import { Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';

// Monetag links used to monetise downloads. A random one will be selected
// for each download to distribute impressions across campaigns. Add or
// remove links here as needed.
const monetagLinks = [
  'https://omg10.com/4/10753737',
  'https://omg10.com/4/10117202',
  'https://omg10.com/4/10656039',
];

export default function DownloadsPage() {
  // Store all files fetched from Supabase
  const [files, setFiles] = useState<any[]>([]);
  const [query, setQuery] = useState('');

  // Fetch files from the database on component mount
  useEffect(() => {
    const fetchFiles = async () => {
      const { data, error } = await supabase
        .from('files')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        console.error(error);
      } else {
        setFiles(data || []);
      }
    };
    fetchFiles();
  }, []);

  // Filter files based on search query
  const filteredFiles = useMemo(() => {
    return files.filter((file) => {
      const q = query.toLowerCase();
      return (
        file.title.toLowerCase().includes(q) ||
        file.description.toLowerCase().includes(q) ||
        file.category.toLowerCase().includes(q) ||
        file.format.toLowerCase().includes(q)
      );
    });
  }, [files, query]);

  // Download handler: choose a random Monetag link, open it in a new tab
  // then start downloading the file in the current tab. This random
  // selection helps distribute traffic across multiple campaigns.
  const handleDownload = (fileUrl: string) => {
    const randomIndex = Math.floor(Math.random() * monetagLinks.length);
    const monetagLink = monetagLinks[randomIndex];
    window.open(monetagLink, '_blank');
    setTimeout(() => {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.target = '_self';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 800);
  };

  return (
    <main className="min-h-screen">
      <NavBar />
      <section className="mx-auto max-w-7xl px-6 py-16">
        <h1 className="text-4xl font-black">All Downloads</h1>
        <p className="mt-4 max-w-2xl text-slate-400">
          Browse all available files. Use the search bar below to filter by name, format, category or description.
        </p>
        <div className="mt-8 max-w-xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search files..."
              className="h-12 w-full rounded-2xl border border-white/10 bg-slate-950/80 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredFiles.map((file) => (
            <FileCard
              key={file.id}
              file={{
                ...file,
                image: file.image_url,
                fileUrl: file.file_url,
                size: file.file_size,
              }}
              onDownload={handleDownload}
            />
          ))}
        </div>
        {filteredFiles.length === 0 && (
          <div className="rounded-[28px] border border-dashed border-white/10 bg-white/[0.03] p-10 text-center text-slate-400">
            No files matched your search.
          </div>
        )}
      </section>
    </main>
  );
}