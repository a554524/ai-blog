import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import type { Post } from './types';

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts');

function toISODate(value: unknown): string | undefined {
  if (value == null) return undefined;
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === 'string') return value.slice(0, 10);
  return String(value);
}

function parsePostFile(filePath: string, fileName: string): Post {
  const raw = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);
  const fm = data as Record<string, unknown>;

  const slug = (fm.slug as string | undefined) ?? fileName.replace(/\.mdx?$/, '');
  if (!fm.title) throw new Error(`Post missing title: ${fileName}`);
  const date = toISODate(fm.date);
  if (!date) throw new Error(`Post missing date: ${fileName}`);

  const stats = readingTime(content);
  const wordCount = content.replace(/\s+/g, '').length;

  return {
    title: String(fm.title),
    slug,
    date,
    updated: toISODate(fm.updated),
    category: fm.category as string | undefined,
    tags: fm.tags as readonly string[] | undefined,
    summary: fm.summary as string | undefined,
    cover: fm.cover as string | undefined,
    draft: (fm.draft as boolean | undefined) ?? false,
    featured: (fm.featured as boolean | undefined) ?? false,
    content,
    readingMinutes: Math.max(1, Math.round(stats.minutes)),
    wordCount,
  };
}

let cached: Post[] | null = null;

function walkMarkdown(dir: string): { full: string; name: string }[] {
  const out: { full: string; name: string }[] = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walkMarkdown(full));
    } else if (/\.mdx?$/.test(entry.name)) {
      out.push({ full, name: entry.name });
    }
  }
  return out;
}

export function getAllPosts(): Post[] {
  if (cached) return cached;

  const files = walkMarkdown(POSTS_DIR);
  const posts = files
    .map((f) => parsePostFile(f.full, f.name))
    .filter((p) => !p.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  cached = posts;
  return posts;
}

export function getPostBySlug(slug: string): Post | null {
  return getAllPosts().find((p) => p.slug === slug) ?? null;
}

export function getPostsByTag(tag: string): Post[] {
  return getAllPosts().filter((p) => p.tags?.includes(tag));
}

export function getPostsByCategory(category: string): Post[] {
  return getAllPosts().filter((p) => p.category === category);
}

export function getAllTags(): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const post of getAllPosts()) {
    for (const tag of post.tags ?? []) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

export function getAllCategories(): { category: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const post of getAllPosts()) {
    if (!post.category) continue;
    counts.set(post.category, (counts.get(post.category) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}

export function getRelatedPosts(current: Post, limit = 3): Post[] {
  const others = getAllPosts().filter((p) => p.slug !== current.slug);
  const currentTags = new Set(current.tags ?? []);
  const scored = others.map((p) => {
    const shared = (p.tags ?? []).filter((t) => currentTags.has(t)).length;
    const sameCategory = p.category === current.category ? 1 : 0;
    return { post: p, score: shared * 2 + sameCategory };
  });
  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.post);
}
