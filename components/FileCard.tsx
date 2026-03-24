"use client";
import { Download, Star } from 'lucide-react';

export interface FileItem {
  id: number | string;
  title: string;
  category: string;
  format: string;
  size: string;
  description: string;
  image: string;
  fileUrl: string;
  rating?: string;
  downloads?: string;
}

interface Props {
  file: FileItem;
  onDownload?: (fileUrl: string) => void;
}

export default function FileCard({ file, onDownload }: Props) {
  const handleClick = () => {
    if (onDownload) {
      onDownload(file.fileUrl);
    }
  };

  return (
    <article className="group overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-lg transition duration-300 hover:-translate-y-1 hover:bg-white/[0.07]">
      {/* App icon area */}
      <div className="flex justify-center border-b border-white/5 bg-black/20 p-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={file.image}
          alt={file.title}
          className="h-20 w-20 rounded-2xl object-contain shadow-lg shadow-blue-500/10"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <span className="rounded-full bg-white/5 px-2 py-1 text-[10px] font-semibold text-slate-300">
            {file.category}
          </span>
          <span className="rounded-full bg-cyan-400/15 px-2 py-1 text-[10px] font-semibold text-cyan-300">
            {file.format}
          </span>
        </div>

        <h3 className="line-clamp-1 text-sm font-bold text-white">
          {file.title}
        </h3>

        <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-400">
          {file.description}
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px] text-slate-300">
          <span className="rounded-full bg-white/5 px-2 py-1">{file.size}</span>
          <span className="rounded-full bg-white/5 px-2 py-1">{file.format}</span>

          {file.rating && (
            <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2 py-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              {file.rating}
            </span>
          )}

          {file.downloads && (
            <span className="rounded-full bg-white/5 px-2 py-1">
              {file.downloads} downloads
            </span>
          )}
        </div>

        <button
          onClick={handleClick}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-3 py-2.5 text-xs font-semibold text-white transition hover:opacity-95"
        >
          <Download className="h-3.5 w-3.5" />
          Download Now
        </button>
      </div>
    </article>
  );
      }
