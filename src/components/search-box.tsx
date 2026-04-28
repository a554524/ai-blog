'use client';

import { useEffect, useRef, useState } from 'react';
import { SearchIcon, CloseIcon } from './icons';

type PagefindResult = {
  id: string;
  data: () => Promise<{
    url: string;
    meta: { title?: string };
    excerpt: string;
  }>;
};

type Pagefind = {
  search: (q: string) => Promise<{ results: PagefindResult[] }>;
};

declare global {
  interface Window {
    pagefind?: Pagefind;
  }
}

type Hit = { url: string; title: string; excerpt: string };

export function SearchBox() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [hits, setHits] = useState<Hit[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen(true);
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  useEffect(() => {
    if (!open || !query.trim()) {
      setHits([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        if (!window.pagefind) {
          const mod = await import(
            /* webpackIgnore: true */ /* @vite-ignore */ '/pagefind/pagefind.js' as string
          );
          window.pagefind = mod as Pagefind;
        }
        const res = await window.pagefind.search(query);
        const data = await Promise.all(res.results.slice(0, 8).map((r) => r.data()));
        if (cancelled) return;
        setHits(
          data.map((d) => ({
            url: d.url,
            title: d.meta.title ?? d.url,
            excerpt: d.excerpt,
          })),
        );
      } catch {
        if (!cancelled) setHits([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [query, open]);

  return (
    <>
      <button
        type="button"
        aria-label="搜索"
        onClick={() => setOpen(true)}
        className="inline-flex h-9 w-9 items-center justify-center rounded border border-border hover:border-fg/40 transition-colors"
      >
        <SearchIcon size={18} />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="全站搜索"
            className="mx-auto mt-24 max-w-prose rounded border border-border bg-bg shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
              <SearchIcon size={18} />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜索文章与工具…"
                className="flex-1 bg-transparent outline-none text-base"
              />
              <button
                type="button"
                aria-label="关闭搜索"
                onClick={() => setOpen(false)}
                className="text-muted hover:text-fg"
              >
                <CloseIcon size={18} />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto">
              {loading && <p className="p-4 text-sm text-muted">搜索中…</p>}
              {!loading && query && hits.length === 0 && (
                <p className="p-4 text-sm text-muted">无结果。</p>
              )}
              {hits.map((h) => (
                <a
                  key={h.url}
                  href={h.url}
                  className="no-underline block px-4 py-3 border-t border-border hover:bg-surface"
                >
                  <div className="font-medium text-sm">{h.title}</div>
                  <div
                    className="mt-1 text-xs text-muted line-clamp-2"
                    dangerouslySetInnerHTML={{ __html: h.excerpt }}
                  />
                </a>
              ))}
            </div>
            <div className="px-4 py-2 text-xs text-muted border-t border-border">
              按 Esc 关闭 · ⌘K / Ctrl+K 唤起
            </div>
          </div>
        </div>
      )}
    </>
  );
}
