import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import type { Post } from '@/lib/types';

export const metadata: Metadata = {
  title: '归档',
  description: '按时间倒序浏览全部文章。',
};

type YearGroup = { year: string; posts: Post[] };

function groupByYear(posts: Post[]): YearGroup[] {
  const map = new Map<string, Post[]>();
  for (const p of posts) {
    const year = p.date.slice(0, 4);
    const list = map.get(year) ?? [];
    list.push(p);
    map.set(year, list);
  }
  return Array.from(map.entries())
    .map(([year, posts]) => ({ year, posts }))
    .sort((a, b) => (a.year < b.year ? 1 : -1));
}

export default function ArchivePage() {
  const posts = getAllPosts();
  const groups = groupByYear(posts);

  return (
    <main className="container-page py-16">
      <header className="mb-10">
        <h1 className="text-2xl font-semibold">归档</h1>
        <p className="mt-2 text-muted text-sm">共 {posts.length} 篇</p>
      </header>

      {groups.length === 0 ? (
        <p className="text-muted">暂无文章。</p>
      ) : (
        <div className="space-y-12">
          {groups.map((g) => (
            <section key={g.year}>
              <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-border">{g.year}</h2>
              <ul className="space-y-3">
                {g.posts.map((p) => (
                  <li key={p.slug} className="flex items-baseline gap-4">
                    <time className="text-xs text-muted tabular-nums w-14 shrink-0" dateTime={p.date}>
                      {p.date.slice(5)}
                    </time>
                    <Link href={`/posts/${p.slug}`} className="no-underline hover:text-accent">
                      {p.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}
