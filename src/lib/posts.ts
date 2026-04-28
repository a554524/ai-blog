import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import type { Post, PostFrontmatter } from './types';

const POSTS_DIR = path.join(process.cwd(), 'content', 'posts');

function parsePostFile(filePath: string, fileName: string): Post {
  const raw = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);
  const fm = data as Partial<PostFrontmatter>;

  const slug = fm.slug ?? fileName.replace(/\.mdx?$/, '');
  if (!fm.title) throw new Error(`Post missing title: ${fileName}`);
  if (!fm.date) throw new Error(`Post missing date: ${fileName}`);

  const stats = readingTime(content);
  const wordCount = content.replace(/\s+/g, '').length;

  return {
    title: fm.title,
    slug,
    date: fm.date,
    updated: fm.updated,
    category: fm.category,
    tags: fm.tags,
    summary: fm.summary,
    cover: fm.cover,
    draft: fm.draft ?? false,
    featured: fm.featured ?? false,
    content,
    readingMinutes: Math.max(1, Math.round(stats.minutes)),
    wordCount,
  };
}

let cached: Post[] | null = null;

export function getAllPosts(): Post[] {
  if (cached) return cached;
  if (!fs.existsSync(POSTS_DIR)) {
    cached = [];
    return cached;
  }

  const files = fs.readdirSync(POSTS_DIR).filter((f) => /\.mdx?$/.test(f));
  const posts = files
    .map((f) => parsePostFile(path.join(POSTS_DIR, f), f))
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
