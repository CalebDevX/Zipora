"use client";
import { useState, useMemo, useEffect } from "react";
import NavBar from "../components/NavBar";
import FileCard from "../components/FileCard";
import {
  Search,
  Music,
  Smartphone,
  FileArchive,
  FileText,
  Monitor,
  Sparkles,
} from "lucide-react";
import { supabase } from "../lib/supabase";

const formatOptions = ["All", "APK", "EXE", "MSI", "ZIP", "RAR", "PDF"];

const categoryCards = [
  { title: "Android Apps", subtitle: "APK", icon: Smartphone },
  { title: "Windows Software", subtitle: "EXE & MSI", icon: Monitor },
  { title: "Archives", subtitle: "ZIP & RAR", icon: FileArchive },
  { title: "Documents", subtitle: "PDF", icon: FileText },
];

export default function HomePage() {
  const [files, setFiles] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("All");

  useEffect(() => {
    const fetchFiles = async () => {
      const { data, error } = await supabase
        .from("files")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
      } else {
        setFiles(data || []);
      }
    };

    fetchFiles();
  }, []);

  const filteredFiles = useMemo(() => {
    return files
      .map((f) => ({
        ...f,
        image: f.image_url,
        fileUrl: f.file_url,
        size: f.file_size,
      }))
      .filter((file) => {
        const lowerQuery = query.toLowerCase();

        const matchesQuery =
          file.title?.toLowerCase().includes(lowerQuery) ||
          file.description?.toLowerCase().includes(lowerQuery) ||
          file.category?.toLowerCase().includes(lowerQuery) ||
          file.format?.toLowerCase().includes(lowerQuery);

        const matchesFormat =
          selectedFormat === "All" || file.format === selectedFormat;

        return matchesQuery && matchesFormat;
      });
  }, [files, query, selectedFormat]);

  const featuredFile = useMemo(() => {
    const featured = files.find((f) => f.is_featured);

    const f = featured || files[0];
    if (!f) return null;

    return {
      ...f,
      image: f.image_url,
      fileUrl: f.file_url,
      size: f.file_size,
    };
  }, [files]);

  const handleDownload = (fileUrl: string) => {
    window.location.href = fileUrl;
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <NavBar />

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 pb-6 pt-6 sm:px-6 md:pb-10 md:pt-10">
        <div className="max-w-4xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-300">
            <Sparkles className="h-3.5 w-3.5" />
            Fast, clean downloads
          </div>

          <h1 className="max-w-3xl text-2xl font-black leading-tight sm:text-3xl md:text-5xl">
            Achek - Zipora
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 md:text-base">
            Download APK, EXE, MSI, ZIP, RAR and PDF files in a cleaner,
            faster and more organised way.
          </p>

          <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-3 shadow-xl shadow-black/10 backdrop-blur-xl">
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search apps, PDFs, ZIPs..."
                  className="h-11 w-full rounded-xl border border-white/10 bg-slate-950/80 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-500"
                />
              </div>

              <a
                href="#downloads"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-950/30"
              >
                Browse
              </a>
            </div>
          </div>

          {/* Filters */}
          <div className="mt-4 flex flex-wrap gap-2">
            {formatOptions.map((option) => (
              <button
                key={option}
                onClick={() => setSelectedFormat(option)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  selectedFormat === option
                    ? "bg-blue-600 text-white"
                    : "border border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.08]"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Apps */}
      {files.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-6 sm:px-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white md:text-2xl">
              Featured Apps
            </h2>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {files
              .filter((f) => f.is_featured)
              .map((file) => {
                const item = {
                  ...file,
                  image: file.image_url,
                  fileUrl: file.file_url,
                  size: file.file_size,
                };

                return (
                  <div
                    key={item.id}
                    className="min-w-[240px] max-w-[240px] rounded-2xl border border-white/10 bg-white/[0.04] p-3 backdrop-blur-xl"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-32 w-full rounded-xl object-cover"
                    />

                    <div className="mt-3">
                      <h3 className="line-clamp-1 text-sm font-semibold text-white">
                        {item.title}
                      </h3>

                      <p className="mt-1 line-clamp-2 text-xs text-slate-400">
                        {item.description}
                      </p>

                      <div className="mt-2 flex gap-2 text-[10px] text-slate-300">
                        <span className="rounded-full bg-white/10 px-2 py-1">
                          {item.format}
                        </span>
                        <span className="rounded-full bg-white/10 px-2 py-1">
                          {item.size}
                        </span>
                      </div>

                      <button
                        onClick={() => handleDownload(item.fileUrl)}
                        className="mt-3 w-full rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 py-2 text-xs font-semibold text-white"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </section>
      )}

      {/* Download Library */}
      <section
        id="downloads"
        className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-12"
      >
        <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">
              Download Library
            </p>
            <h2 className="mt-1 text-2xl font-bold text-white md:text-3xl">
              Browse Files
            </h2>
          </div>

          <div className="text-sm text-slate-400">
            {filteredFiles.length} file{filteredFiles.length !== 1 ? "s" : ""}{" "}
            found
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 min-[420px]:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filteredFiles.map((file) => (
            <FileCard
              key={file.id}
              file={file}
              onDownload={handleDownload}
            />
          ))}
        </div>

        {filteredFiles.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-8 text-center text-sm text-slate-400">
            No files matched your search or selected format.
          </div>
        )}
      </section>

      {/* FluxSave Promotion */}
      <section
        id="fluxsave"
        className="border-y border-white/10 bg-white/[0.03]"
      >
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_0.95fr] lg:items-center">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-fuchsia-400/25 bg-fuchsia-500/10 px-3 py-1 text-xs text-fuchsia-300">
              <Music className="h-3.5 w-3.5" />
              Also powered by FluxSave
            </div>

            <h2 className="text-2xl font-black leading-tight md:text-4xl">
              Need music or social-media downloads too?
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 md:text-base">
              Zipora can introduce users to FluxSave, where they can download
              Spotify music and videos from YouTube, Instagram, TikTok and more.
            </p>

            <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-300">
              {[
                "Spotify Music",
                "YouTube Videos",
                "Instagram Reels",
                "Facebook Videos",
                "Pinterest Media",
                "X Clips",
                "TikTok",
                "Snapchat",
                "Audiomack",
              ].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1"
                >
                  {tag}
                </span>
              ))}
            </div>

            <a
              href="https://fluxsave.achek.com.ng"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-950/30 hover:opacity-90"
            >
              Explore FluxSave
            </a>
          </div>

          <div className="hidden overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 p-5 shadow-xl shadow-black/20 lg:block">
            <div className="flex h-full items-center justify-center text-center text-slate-400">
              <p>FluxSave illustration placeholder</p>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14">
        <h2 className="text-2xl font-bold text-white md:text-3xl">
          About Zipora
        </h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400 md:text-base">
          Zipora is a modern download platform designed for students, creators
          and anyone who needs quick access to digital files. It focuses on
          speed, clarity and clean file discovery across APK, EXE, MSI, ZIP,
          RAR and PDF categories.
        </p>
      </section>
    </main>
  );
                  }        .from("files")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
      } else {
        setFiles(data || []);
      }
    };

    fetchFiles();
  }, []);

  const filteredFiles = useMemo(() => {
    return files
      .map((f) => ({
        ...f,
        image: f.image_url,
        fileUrl: f.file_url,
        size: f.file_size,
      }))
      .filter((file) => {
        const lowerQuery = query.toLowerCase();

        const matchesQuery =
          file.title?.toLowerCase().includes(lowerQuery) ||
          file.description?.toLowerCase().includes(lowerQuery) ||
          file.category?.toLowerCase().includes(lowerQuery) ||
          file.format?.toLowerCase().includes(lowerQuery);

        const matchesFormat =
          selectedFormat === "All" || file.format === selectedFormat;

        return matchesQuery && matchesFormat;
      });
  }, [files, query, selectedFormat]);

  const featuredFile = useMemo(() => {
  const featured = files.find((f) => f.is_featured);

  const f = featured || files[0]; // fallback to latest
  if (!f) return null;

  return {
    ...f,
    image: f.image_url,
    fileUrl: f.file_url,
    size: f.file_size,
  };
}, [files]);
  
  const handleDownload = (fileUrl: string) => {
    const randomIndex = Math.floor(Math.random() * monetagLinks.length);
    const monetagLink = monetagLinks[randomIndex];

    window.open(monetagLink, "_blank");

    setTimeout(() => {
      window.location.href = fileUrl;
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <NavBar />

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 pb-6 pt-6 sm:px-6 md:pb-10 md:pt-10">
        <div className="max-w-4xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-300">
            <Sparkles className="h-3.5 w-3.5" />
            Fast, clean downloads
          </div>

          <h1 className="max-w-3xl text-2xl font-black leading-tight sm:text-3xl md:text-5xl">
            Achek - Zipora
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 md:text-base">
            Download APK, EXE, MSI, ZIP, RAR and PDF files in a cleaner,
            faster and more organised way.
          </p>

          <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-3 shadow-xl shadow-black/10 backdrop-blur-xl">
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search apps, PDFs, ZIPs..."
                  className="h-11 w-full rounded-xl border border-white/10 bg-slate-950/80 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-500"
                />
              </div>

              <a
                href="#downloads"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-950/30"
              >
                Browse
              </a>
            </div>
          </div>

          {/* Filters */}
          <div className="mt-4 flex flex-wrap gap-2">
            {formatOptions.map((option) => (
              <button
                key={option}
                onClick={() => setSelectedFormat(option)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  selectedFormat === option
                    ? "bg-blue-600 text-white"
                    : "border border-white/10 bg-white/[0.04] text-slate-300 hover:bg-white/[0.08]"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </section>

{/* Featured Apps */}
{files.length > 0 && (
  <section className="mx-auto max-w-7xl px-4 pb-6 sm:px-6">

    <div className="mb-3 flex items-center justify-between">
      <h2 className="text-lg font-bold text-white md:text-2xl">
        Featured Apps
      </h2>
    </div>

    {/* Scroll container */}
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">

      {files
        .filter((f) => f.is_featured) // only featured
        .map((file) => {
          const item = {
            ...file,
            image: file.image_url,
            fileUrl: file.file_url,
            size: file.file_size,
          };

          return (
            <div
              key={item.id}
              className="min-w-[240px] max-w-[240px] rounded-2xl border border-white/10 bg-white/[0.04] p-3 backdrop-blur-xl"
            >
              {/* Image */}
              <img
                src={item.image}
                alt={item.title}
                className="h-32 w-full rounded-xl object-cover"
              />

              {/* Info */}
              <div className="mt-3">
                <h3 className="line-clamp-1 text-sm font-semibold text-white">
                  {item.title}
                </h3>

                <p className="mt-1 line-clamp-2 text-xs text-slate-400">
                  {item.description}
                </p>

                <div className="mt-2 flex gap-2 text-[10px] text-slate-300">
                  <span className="rounded-full bg-white/10 px-2 py-1">
                    {item.format}
                  </span>
                  <span className="rounded-full bg-white/10 px-2 py-1">
                    {item.size}
                  </span>
                </div>

                <button
                  onClick={() => handleDownload(item.fileUrl)}
                  className="mt-3 w-full rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 py-2 text-xs font-semibold text-white"
                >
                  Download
                </button>
              </div>
            </div>
          );
        })}
    </div>
  </section>
)}

      {/* Download Library */}
      <section id="downloads" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:py-12">
        <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">
              Download Library
            </p>
            <h2 className="mt-1 text-2xl font-bold text-white md:text-3xl">
              Browse Files
            </h2>
          </div>

          <div className="text-sm text-slate-400">
            {filteredFiles.length} file{filteredFiles.length !== 1 ? "s" : ""} found
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 min-[420px]:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filteredFiles.map((file) => (
            <FileCard
              key={file.id}
              file={file}
              onDownload={handleDownload}
            />
          ))}
        </div>

        {filteredFiles.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-8 text-center text-sm text-slate-400">
            No files matched your search or selected format.
          </div>
        )}
      </section>

      {/* FluxSave Promotion */}
      <section id="fluxsave" className="border-y border-white/10 bg-white/[0.03]">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_0.95fr] lg:items-center">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-fuchsia-400/25 bg-fuchsia-500/10 px-3 py-1 text-xs text-fuchsia-300">
              <Music className="h-3.5 w-3.5" />
              Also powered by FluxSave
            </div>

            <h2 className="text-2xl font-black leading-tight md:text-4xl">
              Need music or social-media downloads too?
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 md:text-base">
              Zipora can introduce users to FluxSave, where they can download
              Spotify music and videos from YouTube, Instagram, TikTok and more.
            </p>

            <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-300">
              {[
                "Spotify Music",
                "YouTube Videos",
                "Instagram Reels",
                "Facebook Videos",
                "Pinterest Media",
                "X Clips",
                "TikTok",
                "Snapchat",
                "Audiomack",
              ].map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1"
                >
                  {tag}
                </span>
              ))}
            </div>

            <a
              href="https://fluxsave.achek.com.ng"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-950/30 hover:opacity-90"
            >
              Explore FluxSave
            </a>
          </div>

          <div className="hidden overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 p-5 shadow-xl shadow-black/20 lg:block">
            <div className="flex h-full items-center justify-center text-center text-slate-400">
              <p>FluxSave illustration placeholder</p>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14">
        <h2 className="text-2xl font-bold text-white md:text-3xl">About Zipora</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400 md:text-base">
          Zipora is a modern download platform designed for students, creators
          and anyone who needs quick access to digital files. It focuses on
          speed, clarity and clean file discovery across APK, EXE, MSI, ZIP,
          RAR and PDF categories.
        </p>
      </section>
    </main>
  );
                                     }
