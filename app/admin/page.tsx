// app/admin/page.tsx
"use client";
import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import NavBar from '../../components/NavBar';
import { slugify, formatFileSize } from '../../lib/utils';
import { supabase } from '../../lib/supabase';

/**
 * Maximum file size (bytes) allowed for Supabase free tier. Files over
 * this size will be uploaded to an external service instead.
 */
const MAX_SUPABASE_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB

interface FormData {
  title: string;
  category: string;
  format: string;
  description: string;
  file?: File;
  image?: File;
}

export default function AdminPage() {
  const [form, setForm] = useState<FormData>({
    title: '',
    category: 'Apps',
    format: 'APK',
    description: '',
  });
  const [seoTitle, setSeoTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Generate SEO title and slug based on form fields
  useEffect(() => {
    if (form.title) {
      const base = `${form.title} ${form.format} Download`;
      setSeoTitle(`${base} for ${form.category}`);
      setSlug(slugify(base));
    } else {
      setSeoTitle('');
      setSlug('');
    }
  }, [form.title, form.category, form.format]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
      if (name === 'file') {
        setFileSize(formatFileSize(files[0].size));
      }
      if (name === 'image') {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result as string);
        };
        reader.readAsDataURL(files[0]);
      }
    }
  };

  /**
   * Upload a file to an external service (e.g. file.io) when it exceeds
   * the Supabase free tier limit. Returns the URL of the uploaded file.
   */
  const uploadFileExternally = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('https://file.io', { method: 'POST', body: formData });
    if (!res.ok) {
      throw new Error('External upload failed');
    }
    const json = await res.json();
    if (!json.link) {
      throw new Error('External upload did not return a link');
    }
    return json.link;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.file || !form.image) {
      alert('Please select both a file and a thumbnail image before uploading.');
      return;
    }

    setUploading(true);
    try {
      // Decide whether to upload via Supabase or external service
      const isLargeFile = form.file.size > MAX_SUPABASE_FILE_SIZE_BYTES;
      let fileUrl = '';
      if (isLargeFile) {
        alert('File is large; uploading via external service. It may take longer.');
        fileUrl = await uploadFileExternally(form.file);
      } else {
        // Upload file to Supabase storage
        const safeName = form.file.name.replace(/\s+/g, '-');
        const filePath = `files/${Date.now()}-${safeName}`;
        const fileType = form.format === 'APK'
          ? 'application/vnd.android.package-archive'
          : form.file.type || 'application/octet-stream';
        const { error: fileError } = await supabase.storage
          .from('files')
          .upload(filePath, form.file, {
            contentType: fileType,
            cacheControl: '3600',
          });
        if (fileError) throw fileError;
        const fileUrlResponse = supabase.storage.from('files').getPublicUrl(filePath);
        fileUrl = fileUrlResponse.data.publicUrl;
      }

      // Upload thumbnail image to Supabase images bucket
      const safeImageName = form.image.name.replace(/\s+/g, '-');
      const imagePath = `images/${Date.now()}-${safeImageName}`;
      const { error: imageErr } = await supabase.storage
        .from('images')
        .upload(imagePath, form.image, {
          contentType: form.image.type,
          cacheControl: '3600',
        });
      if (imageErr) throw imageErr;
      const imageUrlResponse = supabase.storage.from('images').getPublicUrl(imagePath);
      const imageUrl = imageUrlResponse.data.publicUrl;

      // Insert record in database
      const { error: dbErr } = await supabase.from('files').insert([{
        title: form.title,
        seo_title: seoTitle,
        slug,
        description: form.description,
        category: form.category,
        format: form.format,
        file_url: fileUrl,
        image_url: imageUrl,
        file_size: fileSize,
      }]);
      if (dbErr) throw dbErr;

      // Reset form on success
      setForm({ title: '', category: 'Apps', format: 'APK', description: '' });
      setSeoTitle('');
      setSlug('');
      setFileSize('');
      setPreviewImage(null);
      alert('Upload successful! Your file is now available for download.');
    } catch (err: any) {
      console.error(err);
      alert(`Upload failed: ${err.message || 'Unknown error'}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="min-h-screen">
      <NavBar />
      <section className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-4xl font-black">Admin Upload Dashboard</h1>
        <p className="mt-4 text-slate-400">
          Upload new files and automatically generate SEO titles and slugs. Files over 50 MB
          will be stored off-site.
        </p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Title input */}
          <div>
            <label className="block text-sm font-medium text-slate-300" htmlFor="title">
              App/File Name
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleInputChange}
              className="mt-1 w-full rounded-lg border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-blue-500"
              placeholder="Example: CapCut Pro APK"
              required
              disabled={uploading}
            />
          </div>
          {/* Category, Format, and File Size */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-slate-300" htmlFor="category">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={form.category}
                onChange={handleInputChange}
                className="mt-1 w-full rounded-lg border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white focus:border-blue-500"
                disabled={uploading}
              >
                <option value="Apps">Apps</option>
                <option value="Software">Software</option>
                <option value="Resources">Resources</option>
                <option value="Documents">Documents</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300" htmlFor="format">
                Format
              </label>
              <select
                id="format"
                name="format"
                value={form.format}
                onChange={handleInputChange}
                className="mt-1 w-full rounded-lg border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white focus:border-blue-500"
                disabled={uploading}
              >
                <option value="APK">APK</option>
                <option value="EXE">EXE</option>
                <option value="MSI">MSI</option>
                <option value="ZIP">ZIP</option>
                <option value="RAR">RAR</option>
                <option value="PDF">PDF</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300" htmlFor="fileSize">
                File Size (auto)
              </label>
              <input
                id="fileSize"
                type="text"
                disabled
                value={fileSize}
                placeholder="--"
                className="mt-1 w-full rounded-lg border border-white/10 bg-slate-900/40 px-4 py-3 text-sm text-slate-400"
              />
            </div>
          </div>
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-300" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={form.description}
              onChange={handleInputChange}
              className="mt-1 w-full rounded-lg border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-blue-500"
              placeholder="Enter a short description of the file"
              disabled={uploading}
            />
          </div>
          {/* File and Image Inputs */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-300" htmlFor="file">
                Upload File
              </label>
              <input
                id="file"
                name="file"
                type="file"
                onChange={handleFileChange}
                className="mt-1 w-full cursor-pointer rounded-lg border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-white hover:file:bg-blue-700"
                disabled={uploading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300" htmlFor="image">
                Upload Image (thumbnail)
              </label>
              <input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="mt-1 w-full cursor-pointer rounded-lg border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-white file:mr-4 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-white hover:file:bg-blue-700"
                disabled={uploading}
              />
              {previewImage && (
                <img
                  src={previewImage}
                  alt="Preview"
                  className="mt-4 h-40 w-auto rounded-lg border border-white/10 object-contain"
                />
              )}
            </div>
          </div>
          {/* Generated SEO and Slug */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-slate-300" htmlFor="seoTitle">
                SEO Title (auto)
              </label>
              <input
                id="seoTitle"
                type="text"
                disabled
                value={seoTitle}
                placeholder="SEO Title will be generated"
                className="mt-1 w-full rounded-lg border border-white/10 bg-slate-900/40 px-4 py-3 text-sm text-slate-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300" htmlFor="slug">
                URL Slug (auto)
              </label>
              <input
                id="slug"
                type="text"
                disabled
                value={slug}
                placeholder="URL Slug will be generated"
                className="mt-1 w-full rounded-lg border border-white/10 bg-slate-900/40 px-4 py-3 text-sm text-slate-400"
              />
            </div>
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            disabled={uploading}
            className={`w-full rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-blue-950/30 ${uploading ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-95'}`}
          >
            {uploading ? 'Uploading...' : 'Upload File'}
          </button>
        </form>
      </section>
    </main>
  );
          }
