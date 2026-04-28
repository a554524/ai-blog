import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import type { Tool } from './types';

const TOOLS_DIR = path.join(process.cwd(), 'content', 'tools');

function toISODate(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === 'string') return value.slice(0, 10);
  return new Date().toISOString().slice(0, 10);
}

function parseToolFile(filePath: string, fileName: string): Tool {
  const raw = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);
  const fm = data as Record<string, unknown>;

  const slug = (fm.slug as string | undefined) ?? fileName.replace(/\.mdx?$/, '');
  if (!fm.name) throw new Error(`Tool missing name: ${fileName}`);
  if (!fm.url) throw new Error(`Tool missing url: ${fileName}`);
  if (!fm.category) throw new Error(`Tool missing category: ${fileName}`);

  return {
    slug,
    name: String(fm.name),
    logo: fm.logo as string | undefined,
    url: String(fm.url),
    category: String(fm.category),
    tags: fm.tags as readonly string[] | undefined,
    freeTier: String(fm.freeTier ?? ''),
    pricing: fm.pricing as string | undefined,
    rating: fm.rating as number | undefined,
    featured: (fm.featured as boolean | undefined) ?? false,
    reviewPost: fm.reviewPost as string | undefined,
    updatedAt: toISODate(fm.updatedAt),
    description: content,
  };
}

let cached: Tool[] | null = null;

export function getAllTools(): Tool[] {
  if (cached) return cached;
  if (!fs.existsSync(TOOLS_DIR)) {
    cached = [];
    return cached;
  }

  const files = fs.readdirSync(TOOLS_DIR).filter((f) => /\.mdx?$/.test(f));
  const tools = files
    .map((f) => parseToolFile(path.join(TOOLS_DIR, f), f))
    .sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      return a.updatedAt < b.updatedAt ? 1 : -1;
    });

  cached = tools;
  return tools;
}

export function getToolBySlug(slug: string): Tool | null {
  return getAllTools().find((t) => t.slug === slug) ?? null;
}

export function getToolCategories(): { category: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const t of getAllTools()) {
    counts.set(t.category, (counts.get(t.category) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}

export function getToolTags(): string[] {
  const set = new Set<string>();
  for (const t of getAllTools()) {
    for (const tag of t.tags ?? []) set.add(tag);
  }
  return Array.from(set).sort();
}
