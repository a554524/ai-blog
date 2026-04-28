import Link from 'next/link';
import { site } from '@/lib/site';

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-border mt-24">
      <div className="container-page py-12 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <div className="font-semibold">{site.name}</div>
          <div className="text-sm text-muted">{site.tagline}</div>
        </div>
        <nav aria-label="页脚导航" className="flex flex-wrap gap-6 text-sm text-muted">
          <Link href="/rss.xml" className="no-underline hover:text-fg">
            RSS
          </Link>
          <Link href="/archive" className="no-underline hover:text-fg">
            归档
          </Link>
          <Link href="/about" className="no-underline hover:text-fg">
            关于
          </Link>
        </nav>
      </div>
      <div className="container-page pb-8 text-xs text-muted">
        © {year} {site.name} · 内容采用 CC BY-NC-SA 4.0 授权
      </div>
    </footer>
  );
}
