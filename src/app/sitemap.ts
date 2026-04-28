import type { MetadataRoute } from 'next';
import { getAllPosts, getAllTags, getAllCategories } from '@/lib/posts';
import { getAllTools } from '@/lib/tools';
import { site } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url.replace(/\/$/, '');
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${base}/posts`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/tools`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/archive`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: `${base}/tags`, lastModified: now, changeFrequency: 'weekly', priority: 0.5 },
    { url: `${base}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
  ];

  const postRoutes = getAllPosts().map((p) => ({
    url: `${base}/posts/${p.slug}`,
    lastModified: new Date(p.updated ?? p.date),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  const toolRoutes = getAllTools().map((t) => ({
    url: `${base}/tools/${t.slug}`,
    lastModified: new Date(t.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const tagRoutes = getAllTags().map((t) => ({
    url: `${base}/tags/${encodeURIComponent(t.tag)}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.4,
  }));

  const categoryRoutes = getAllCategories().map((c) => ({
    url: `${base}/categories/${encodeURIComponent(c.category)}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...postRoutes, ...toolRoutes, ...tagRoutes, ...categoryRoutes];
}
