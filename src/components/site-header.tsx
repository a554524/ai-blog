import Link from 'next/link';
import { site } from '@/lib/site';
import { ThemeToggle } from './theme-toggle';

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-bg/80 backdrop-blur sticky top-0 z-40">
      <div className="container-page flex h-16 items-center justify-between">
        <Link
          href="/"
          className="no-underline font-semibold tracking-tight text-base"
          aria-label={site.name}
        >
          {site.name}
        </Link>

        <nav aria-label="主导航" className="hidden md:flex items-center gap-8">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="no-underline text-sm text-muted hover:text-fg transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
