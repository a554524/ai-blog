import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllTags } from '@/lib/posts';

export const metadata: Metadata = {
  title: '标签',
  description: '全部文章标签索引。',
};

export default function TagsIndexPage() {
  const tags = getAllTags();
  return (
    <main className="container-page py-16">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold">标签</h1>
        <p className="mt-2 text-muted text-sm">共 {tags.length} 个</p>
      </header>
      {tags.length === 0 ? (
        <p className="text-muted">暂无标签。</p>
      ) : (
        <ul className="flex flex-wrap gap-3">
          {tags.map((t) => (
            <li key={t.tag}>
              <Link
                href={`/tags/${encodeURIComponent(t.tag)}`}
                className="no-underline inline-flex items-baseline gap-1 rounded border border-border px-3 py-1.5 text-sm hover:border-fg/40"
              >
                <span>#{t.tag}</span>
                <span className="text-xs text-muted">{t.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
