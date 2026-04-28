import Link from 'next/link';
import { ExternalLinkIcon } from './icons';
import type { Tool } from '@/lib/types';

export function ToolCard({ tool }: { tool: Tool }) {
  return (
    <article className="border border-border rounded p-5 hover:border-fg/30 transition-colors">
      <div className="flex items-baseline justify-between gap-4 mb-2">
        <Link href={`/tools/${tool.slug}`} className="no-underline">
          <h3 className="text-base font-semibold hover:text-accent transition-colors">
            {tool.name}
          </h3>
        </Link>
        <span className="text-xs text-muted shrink-0">{tool.category}</span>
      </div>

      <p className="text-sm text-muted line-clamp-2">{tool.description.trim()}</p>

      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2 text-xs text-muted">
          {tool.tags?.slice(0, 3).map((t) => (
            <span key={t}>#{t}</span>
          ))}
        </div>
        <a
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="no-underline inline-flex items-center gap-1 text-sm hover:text-accent shrink-0"
          aria-label={`访问 ${tool.name}`}
        >
          访问 <ExternalLinkIcon size={14} />
        </a>
      </div>
    </article>
  );
}
