"use client";
import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import NavBar from '../../components/NavBar';
import { slugify, formatFileSize } from '../../lib/utils';
import { supabase } from '../../lib/supabase';

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

  // Update SEO title and slug whenever title or format changes.
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
   * Handle form submission for uploading a file. This will upload both
   * the binary file and its thumbnail image to Supabase storage, then
   * create a corresponding record in the `files` table. Errors are
   * surfaced via alerts, while a successful upload resets the form
   * state and informs the user.
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // Ensure a file and image have been selected
    if (!form.file || !form.image) {
      alert('Please select both a file and a thumbnail image before uploading.');
      return;
    }

    try {
      // Upload the binary file to the "files" bucket
      const safeName = form.file.name.replace(/\s+/g, '-');
const filePath = `files/${Date.now()}-${safeName}`;

// detect file type automatically
const fileType =
  form.format === 'APK'
    ? 'application/vnd.android.package-archive'
    : form.file.type || 'application/octet-stream';

const { error: fileError } = await supabase.storage
  .from('files')
  .upload(filePath, form.file, {
    contentType: fileType
  });
      if (fileError) throw fileError;

      const fileUrlResponse = supabase.storage
        .from('files')
        .getPublicUrl(filePath);
      const fileUrl = fileUrlResponse.data.publicUrl;

      // Upload the thumbnail image to the "images" bucket
      const safeImageName = form.image.name.replace(/\s+/g, '-');
const imagePath = `images/${Date.now()}-${safeImageName}`;

const { error: imageError } = await supabase.storage
  .from('images')
  .upload(imagePath, form.image, {
    contentType: form.image.type
  });
      if (imageError) throw imageError;

      const imageUrlResponse = supabase.storage
        .from('images')
        .getPublicUrl(imagePath);
      const imageUrl = imageUrlResponse.data.publicUrl;

      // Insert a new record into the files table
      const { error: dbError } = await supabase.from('files').insert([
        {
          title: form.title,
          seo_title: seoTitle,
          slug: slug,
          description: form.description,
          category: form.category,
          format: form.format,
          file_url: fileUrl,
          image_url: imageUrl,
          file_size: fileSize,
        },
      ]);
      if (dbError) throw dbError;

      // Reset the form after successful upload
      setForm({ title: '', category: 'Apps', format: 'APK', description: '' });
      setSeoTitle('');
      setSlug('');
      setFileSize('');
      setPreviewImage(null);

      alert('Upload successful! Your file is now available for download.');
    } catch (err: any) {
  console.error('FULL ERROR:', err);
  alert(`Failed: ${JSON.stringify(err, null, 2)}`);
    }
  };

  return (
    <main className="min-h-screen">
      <NavBar />
      <section className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-4xl font-black">Admin Upload Dashboard</h1>
        <p className="mt-4 text-slate-400">Upload new files and automatically generate SEO titles and slugs.</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
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
            />
          </div>
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
            />
          </div>
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
              />
              {previewImage && (
                <img src={previewImage} alt="Preview" className="mt-4 h-40 w-auto rounded-lg border border-white/10 object-contain" />
              )}
            </div>
          </div>
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
          <button
            type="submit"
            className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-blue-950/30 hover:opacity-95"
          >
            Upload File
          </button>
        </form>
      </section>
    </main>
  );
}
