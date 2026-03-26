import type { MetadataRoute } from 'next';
import { supabase } from '../lib/supabase'; // adjust path if needed

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://zipora.achek.com.ng';

  // Fetch files from Supabase
  const { data: files, error } = await supabase
    .from('files')
    .select('slug, created_at');

  if (error) {
    console.error('Sitemap fetch error:', error);
  }

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/downloads`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ];

  // Dynamic file pages
  const filePages: MetadataRoute.Sitemap =
    files?.map((file) => ({
      url: `${baseUrl}/file/${file.slug}`,
      lastModified: file.created_at
        ? new Date(file.created_at)
        : new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    })) || [];

  return [...staticPages, ...filePages];
}
