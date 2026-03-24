// components/FileCard.tsx
"use client";
import { Download } from "lucide-react";

export interface FileItem {
  id: number | string;
  title: string;
  category: string;
  format: string;
  size: string;
  description: string;
  image: string;
  fileUrl: string;
}

interface Props {
  file: FileItem;
  onDownload?: (fileUrl: string) => void;
}

/**
 * A responsive card showing a file with cover image and download button.
 * On mobile, the card becomes flat for easier scrolling.
 */
export default function FileCard({ file, onDownload }: Props) {
  const handleClick = () => {
    onDownload?.(file.fileUrl);
  };

  return (
    <article className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] transition duration-300 hover:-translate-y-1 hover:bg-white/[0.08]">
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={file.image}
          alt={file.title}
          className="h-52 w-full object-cover"
        />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3 text-xs">
          <span className="rounded-full border border-white/20 bg-black/40 px-2 py-0.5 text-white backdrop-blur">{file.category}</span>
          <span className="rounded-full bg-cyan-400/15 px-2 py-0.5 text-cyan-300 backdrop-blur">{file.format}</span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-white">{file.title}</h3>
        <p className="mt-2 text-sm text-slate-400 line-clamp-3">{file.description}</p>
        <div className="mt-4 flex items-center gap-2 text-xs text-slate-300">
          <span className="rounded-full bg-white/5 px-3 py-1">{file.size}</span>
          <span className="rounded-full bg-white/5 px-3 py-1">{file.format}</span>
        </div>
        <button
          onClick={handleClick}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-3 text-sm font-semibold text-white hover:opacity-90"
        >
          <Download className="h-4 w-4" />
          Download Now
        </button>
      </div>
    </article>
  );
}
