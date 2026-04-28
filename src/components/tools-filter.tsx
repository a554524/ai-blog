'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { ToolCard } from './tool-card';
import type { Tool } from '@/lib/types';

type Props = {
  tools: Tool[];
  categories: { category: string; count: number }[];
  tags: string[];
};

function buildHref(params: URLSearchParams, patch: Record<string, string | null>): string {
  const next = new URLSearchParams(params);
  for (const [k, v] of Object.entries(patch)) {
    if (v === null) next.delete(k);
    else next.set(k, v);
  }
  const q = next.toString();
  return q ? `/tools?${q}` : '/tools';
}

export function ToolsFilter({ tools, categories, tags }: Props) {
  const params = useSearchParams();
  const activeCategory = params.get('category');
  const activeTag = params.get('tag');

  const filtered = useMemo(() => {
    return tools.filter((t) => {
      if (activeCategory && t.category !== activeCategory) return false;
      if (activeTag && !(t.tags ?? []).includes(activeTag)) return false;
      return true;
    });
  }, [tools, activeCategory, activeTag]);

  return (
    <>
      <div className="space-y-4 mb-8">
        <div>
          <div className="text-xs text-muted mb-2">分类</div>
          <div className="flex flex-wrap gap-2">
            <Link
              href={buildHref(params, { category: null })}
              className={`no-underline rounded border px-3 py-1 text-sm ${
                !activeCategory ? 'border-fg bg-surface' : 'border-border hover:border-fg/40'
              }`}
            >
              全部
            </Link>
            {categories.map((c) => (
              <Link
                key={c.category}
                href={buildHref(params, { category: c.category })}
                className={`no-underline rounded border px-3 py-1 text-sm ${
                  activeCategory === c.category
                    ? 'border-fg bg-surface'
                    : 'border-border hover:border-fg/40'
                }`}
              >
                {c.category}
                <span className="ml-1 text-xs text-muted">{c.count}</span>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <div className="text-xs text-muted mb-2">标签</div>
          <div className="flex flex-wrap gap-2">
            <Link
              href={buildHref(params, { tag: null })}
              className={`no-underline rounded border px-3 py-1 text-sm ${
                !activeTag ? 'border-fg bg-surface' : 'border-border hover:border-fg/40'
              }`}
            >
              全部
            </Link>
            {tags.map((t) => (
              <Link
                key={t}
                href={buildHref(params, { tag: t })}
                className={`no-underline rounded border px-3 py-1 text-sm ${
                  activeTag === t ? 'border-fg bg-surface' : 'border-border hover:border-fg/40'
                }`}
              >
                #{t}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="text-sm text-muted mb-4">共 {filtered.length} 个工具</div>
      {filtered.length === 0 ? (
        <p className="text-muted py-8">未找到符合条件的工具。</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((t) => (
            <ToolCard key={t.slug} tool={t} />
          ))}
        </div>
      )}
    </>
  );
}
