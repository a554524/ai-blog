import { getAllPosts } from './posts';
import { site } from './site';

function escapeXML(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function generateRSS(): string {
  const base = site.url.replace(/\/$/, '');
  const posts = getAllPosts().slice(0, 30);
  const lastBuildDate = new Date().toUTCString();

  const items = posts
    .map((p) => {
      const url = `${base}/posts/${p.slug}`;
      const pubDate = new Date(p.date).toUTCString();
      const summary = p.summary ?? '';
      const categories = (p.tags ?? [])
        .map((t) => `    <category>${escapeXML(t)}</category>`)
        .join('\n');
      return `  <item>
    <title>${escapeXML(p.title)}</title>
    <link>${url}</link>
    <guid isPermaLink="true">${url}</guid>
    <pubDate>${pubDate}</pubDate>
    <description>${escapeXML(summary)}</description>
${categories}
  </item>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>${escapeXML(site.name)}</title>
  <link>${base}</link>
  <atom:link href="${base}/rss.xml" rel="self" type="application/rss+xml" />
  <description>${escapeXML(site.description)}</description>
  <language>zh-CN</language>
  <lastBuildDate>${lastBuildDate}</lastBuildDate>
${items}
</channel>
</rss>`;
}
