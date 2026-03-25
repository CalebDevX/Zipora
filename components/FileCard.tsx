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

export default function FileCard({ file, onDownload }: Props) {
  const handleClick = () => {
    onDownload?.(file.fileUrl);
  };

  return (
    <article className="group overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] transition duration-300 hover:-translate-y-0.5 hover:bg-white/[0.06]">
      <div className="relative">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={file.image}
          alt={file.title}
          className="h-24 w-full object-cover sm:h-32"
        />

        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-2 text-[10px]">
          <span className="max-w-[55%] truncate rounded-full border border-white/20 bg-black/40 px-2 py-0.5 text-white backdrop-blur">
            {file.category}
          </span>
          <span className="rounded-full bg-cyan-400/15 px-2 py-0.5 text-cyan-300 backdrop-blur">
            {file.format}
          </span>
        </div>
      </div>

      <div className="p-3">
        <h3 className="line-clamp-1 text-sm font-semibold text-white sm:text-base">
          {file.title}
        </h3>

        <p className="mt-1 line-clamp-2 text-[11px] leading-5 text-slate-400 sm:text-xs">
          {file.description}
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[10px] text-slate-300 sm:text-[11px]">
          <span className="rounded-full bg-white/5 px-2 py-1">{file.size}</span>
          <span className="rounded-full bg-white/5 px-2 py-1">{file.format}</span>
        </div>

        <button
          onClick={handleClick}
          className="mt-3 flex h-9 w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-3 text-xs font-semibold text-white hover:opacity-90 sm:h-10 sm:text-sm"
        >
          <Download className="h-3.5 w-3.5" />
          Download
        </button>
      </div>
    </article>
  );
}
