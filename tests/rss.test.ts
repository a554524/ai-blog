import { describe, it, expect } from 'vitest';
import { generateRSS } from '@/lib/rss';
import { getAllPosts } from '@/lib/posts';

describe('rss generator', () => {
  it('emits well-formed XML with channel metadata', () => {
    const xml = generateRSS();
    expect(xml).toMatch(/^<\?xml version="1\.0" encoding="UTF-8"\?>/);
    expect(xml).toContain('<rss version="2.0"');
    expect(xml).toContain('<channel>');
    expect(xml).toContain('</channel>');
    expect(xml).toContain('<language>zh-CN</language>');
  });

  it('contains one item per post', () => {
    const xml = generateRSS();
    const posts = getAllPosts();
    const itemCount = (xml.match(/<item>/g) ?? []).length;
    expect(itemCount).toBe(Math.min(posts.length, 30));
  });

  it('escapes XML special characters in titles', () => {
    const xml = generateRSS();
    expect(xml).not.toContain(' & '); // ampersand must be escaped
  });
});
