'use client';

import { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes';

type GiscusConfig = {
  repo: string;
  repoId: string;
  category: string;
  categoryId: string;
};

function readConfig(): GiscusConfig | null {
  const repo = process.env.NEXT_PUBLIC_GISCUS_REPO;
  const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID;
  const category = process.env.NEXT_PUBLIC_GISCUS_CATEGORY;
  const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID;
  if (!repo || !repoId || !category || !categoryId) return null;
  return { repo, repoId, category, categoryId };
}

export function GiscusComments() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const { resolvedTheme } = useTheme();

  const config = readConfig();

  useEffect(() => {
    if (!ref.current || visible) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px' },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [visible]);

  useEffect(() => {
    if (!visible || !config || !ref.current) return;
    ref.current.innerHTML = '';
    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.setAttribute('data-repo', config.repo);
    script.setAttribute('data-repo-id', config.repoId);
    script.setAttribute('data-category', config.category);
    script.setAttribute('data-category-id', config.categoryId);
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'top');
    script.setAttribute('data-theme', resolvedTheme === 'dark' ? 'dark' : 'light');
    script.setAttribute('data-lang', 'zh-CN');
    script.setAttribute('data-loading', 'lazy');
    ref.current.appendChild(script);
  }, [visible, resolvedTheme, config]);

  return (
    <section className="mt-16 pt-8 border-t border-border" aria-label="评论">
      <h2 className="text-base font-semibold mb-6">评论</h2>
      {config ? (
        <div ref={ref} />
      ) : (
        <div ref={ref} className="text-sm text-muted">
          评论功能需要配置 Giscus 环境变量后启用。
        </div>
      )}
    </section>
  );
}
