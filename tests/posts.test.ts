import { describe, it, expect } from 'vitest';
import {
  getAllPosts,
  getPostBySlug,
  getPostsByTag,
  getAllTags,
  getAllCategories,
  getRelatedPosts,
} from '@/lib/posts';

describe('posts lib', () => {
  it('loads posts from content/posts', () => {
    const posts = getAllPosts();
    expect(posts.length).toBeGreaterThan(0);
  });

  it('sorts posts by date descending', () => {
    const posts = getAllPosts();
    for (let i = 1; i < posts.length; i++) {
      expect(posts[i - 1]!.date >= posts[i]!.date).toBe(true);
    }
  });

  it('findsPostBySlug returns post or null', () => {
    const first = getAllPosts()[0];
    expect(first).toBeDefined();
    expect(getPostBySlug(first!.slug)?.slug).toBe(first!.slug);
    expect(getPostBySlug('__not_exist__')).toBeNull();
  });

  it('filters draft posts', () => {
    const posts = getAllPosts();
    expect(posts.every((p) => !p.draft)).toBe(true);
  });

  it('computes reading time and word count', () => {
    const post = getAllPosts()[0]!;
    expect(post.readingMinutes).toBeGreaterThanOrEqual(1);
    expect(post.wordCount).toBeGreaterThan(0);
  });

  it('getPostsByTag returns matching posts', () => {
    const tags = getAllTags();
    if (tags.length === 0) return;
    const firstTag = tags[0]!.tag;
    const posts = getPostsByTag(firstTag);
    expect(posts.length).toBe(tags[0]!.count);
    expect(posts.every((p) => p.tags?.includes(firstTag))).toBe(true);
  });

  it('getAllCategories counts correctly', () => {
    const cats = getAllCategories();
    const posts = getAllPosts();
    const total = cats.reduce((s, c) => s + c.count, 0);
    const withCategory = posts.filter((p) => p.category).length;
    expect(total).toBe(withCategory);
  });

  it('getRelatedPosts excludes current and respects limit', () => {
    const current = getAllPosts()[0]!;
    const related = getRelatedPosts(current, 5);
    expect(related.every((r) => r.slug !== current.slug)).toBe(true);
    expect(related.length).toBeLessThanOrEqual(5);
  });
});
