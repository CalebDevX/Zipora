// app/page.tsx (HomePage)
"use client";
import { useState, useMemo, useEffect } from "react";
import NavBar from "../components/NavBar";
import FileCard from "../components/FileCard";
import { Search, Download, Music, Smartphone, FileArchive, FileText, Monitor, Sparkles } from "lucide-react";
import { supabase } from "../lib/supabase";

// Format tabs
const formatOptions = ["All", "APK", "EXE", "MSI", "ZIP", "RAR", "PDF"];

// Category cards for hero section
const categoryCards = [
  { title: "Android Apps", subtitle: "APK files", icon: Smartphone },
  { title: "Windows Software", subtitle: "EXE & MSI", icon: Monitor },
  { title: "Archives", subtitle: "ZIP & RAR", icon: FileArchive },
  { title: "Documents", subtitle: "PDF files", icon: FileText }
];

// Monetag campaigns
const monetagLinks = [
  "https://omg10.com/4/10753737",
  "https://omg10.com/4/10117202",
  "https://omg10.com/4/10656039"
];

export default function HomePage() {
  const [files, setFiles] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("All");

  // Fetch files on mount
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

  // Determine featured file (first in list)
  const featuredFile = useMemo(() => {
    if (files.length === 0) return null;
    const f = files[0];
    return {
      ...f,
      image: f.image_url,
      fileUrl: f.file_url,
      size: f.file_size
    };
  }, [files]);

  // Filter files by query and format
  const filteredFiles = useMemo(() => {
    return files
      .map(f => ({
        ...f,
        image: f.image_url,
        fileUrl: f.file_url,
        size: f.file_size
      }))
      .filter(file => {
        const lowerQuery = query.toLowerCase();
        const matchesQuery =
          file.title.toLowerCase().includes(lowerQuery) ||
          file.description.toLowerCase().includes(lowerQuery) ||
          file.category.toLowerCase().includes(lowerQuery) ||
          file.format.toLowerCase().includes(lowerQuery);
        const matchesFormat = selectedFormat === "All" || file.format === selectedFormat;
        return matchesQuery && matchesFormat;
      });
  }, [files, query, selectedFormat]);

  // Handle downloads through monetag links
  const handleDownload = (fileUrl: string) => {
    const randomIndex = Math.floor(Math.random() * monetagLinks.length);
    const monetagLink = monetagLinks[randomIndex];
    window.open(monetagLink, "_blank");
    setTimeout(() => {
      const link = document.createElement("a");
      link.href = fileUrl;
      link.target = "_self";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 800);
  };

  return (
    <main className="min-h-screen">
      <NavBar />
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          {/* Left side: text */}
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-1 text-sm text-cyan-300">
              <Sparkles className="h-4 w-4" />
              Clean download experience
            </div>
            <h1 className="max-w-3xl text-4xl font-black leading-tight md:text-6xl">
              Zipora Downloads – Fast App, Software and File Downloads
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 md:text-lg">
              Browse organised categories like APK, EXE, MSI, ZIP, RAR and PDF. Each file page is clean, modern and SEO‑friendly.
            </p>
            {/* Search and browse */}
            <div className="mt-8 rounded-[28px] border border-white/10 bg-white/[0.04] p-4 shadow-2xl shadow-black/20 backdrop-blur-xl">
              <div className="flex flex-col gap-3 md:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search apps, software, PDF, ZIP, EXE..."
                    className="h-14 w-full rounded-2xl border border-white/10 bg-slate-950/80 pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-500"
                  />
                </div>
                <a
                  href="#downloads"
                  className="inline-flex h-14 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 text-sm font-semibold text-white shadow-lg shadow-blue-950/30"
                >
                  Browse Files
                </a>
              </div>
            </div>
            {/* Format Filters */}
            <div className="mt-8 flex flex-wrap gap-3">
              {formatOptions.map(option => (
                <button
                  key={option}
                  onClick={() => setSelectedFormat(option)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
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
          {/* Right side: Featured file */}
          {featuredFile && (
            <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-4 shadow-2xl shadow-black/25 backdrop-blur-xl">
              <div className="overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/90">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={featuredFile.image}
                  alt={featuredFile.title}
                  className="h-64 w-full object-cover"
                />
                <div className="p-5">
                  <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-slate-300">
                    <span className="rounded-full bg-white/5 px-3 py-1">Featured</span>
                    <span className="rounded-full bg-white/5 px-3 py-1">{featuredFile.format}</span>
                    <span className="rounded-full bg-white/5 px-3 py-1">{featuredFile.size}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white">{featuredFile.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {featuredFile.description}
                  </p>
                  <button
                    onClick={() => handleDownload(featuredFile.fileUrl)}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white hover:opacity-90"
                  >
                    <Download className="h-4 w-4" />
                    Download Featured File
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      {/* Category Cards */}
      <section className="mx-auto max-w-7xl px-6 pb-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {categoryCards.map(({ title, subtitle, icon: Icon }) => (
            <div
              key={title}
              className="rounded-[24px] border border-white/10 bg-white/[0.04] p-5 shadow-xl shadow-black/10"
            >
              <div className="mb-4 inline-flex rounded-2xl bg-blue-500/10 p-3 text-blue-300">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-white">{title}</h3>
              <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
            </div>
          ))}
        </div>
      </section>
      {/* Download Library */}
      <section id="downloads" className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Download Library</p>
            <h2 className="mt-2 text-3xl font-bold text-white">All Categories and File Formats</h2>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-slate-400">
            Upload new files through the admin dashboard. Every file includes title, SEO title, description, category, format and the actual file size.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredFiles.map(file => (
            <FileCard
              key={file.id}
              file={file}
              onDownload={handleDownload}
            />
          ))}
        </div>
        {filteredFiles.length === 0 && (
          <div className="rounded-[28px] border border-dashed border-white/10 bg-white/[0.03] p-10 text-center text-slate-400">
            No files matched your search or selected format.
          </div>
        )}
      </section>
      {/* FluxSave Promotion */}
      <section id="fluxsave" className="border-y border-white/10 bg-white/[0.03]">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-16 lg:grid-cols-[1fr_0.95fr] lg:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-fuchsia-400/25 bg-fuchsia-500/10 px-4 py-1 text-sm text-fuchsia-300">
              <Music className="h-4 w-4" />
              Also powered by FluxSave
            </div>
            <h2 className="text-3xl font-black leading-tight md:text-5xl">
              Need music or social‑media downloads too?
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
              Zipora can introduce users to FluxSave, where they can download Spotify music and videos from platforms like YouTube, Instagram and TikTok—all in one place.
            </p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-300">
              {[
                "Spotify Music",
                "YouTube Videos",
                "Instagram Reels",
                "Facebook Videos",
                "Pinterest Media",
                "X Clips",
                "TikTok",
                "Snapchat",
                "Audiomack"
              ].map(tag => (
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
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-950/30 hover:opacity-90"
            >
              Explore FluxSave
            </a>
          </div>
          <div className="hidden overflow-hidden rounded-[28px] border border-white/10 bg-slate-900/80 p-6 shadow-xl shadow-black/20 lg:block">
            <div className="flex h-full items-center justify-center text-center text-slate-400">
              <p>FluxSave illustration placeholder</p>
            </div>
          </div>
        </div>
      </section>
      {/* About */}
      <section id="about" className="mx-auto max-w-7xl px-6 py-16">
        <h2 className="text-3xl font-bold text-white">About Zipora</h2>
        <p className="mt-4 max-w-3xl text-base leading-7 text-slate-400">
          Zipora is a modern download platform designed for students, creators and anyone who needs quick access to digital files. Built with performance, clarity and search visibility in mind, it offers clean file pages, rich metadata and a simple admin dashboard for adding new uploads. Files can be categorised into APK, EXE, MSI, ZIP, RAR and PDF to help users navigate and discover downloads more easily.
        </p>
      </section>
    </main>
  );
      }
