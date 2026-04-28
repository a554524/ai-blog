import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllTools, getToolBySlug } from '@/lib/tools';
import { ExternalLinkIcon } from '@/components/icons';

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getAllTools().map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return {};
  return {
    title: tool.name,
    description: tool.description.slice(0, 120),
  };
}

export default async function ToolPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();

  return (
    <main className="container-prose py-16">
      <div className="mb-6 text-sm">
        <Link href="/tools" className="no-underline text-muted hover:text-fg">
          ← 返回工具目录
        </Link>
      </div>

      <header className="mb-8 pb-6 border-b border-border">
        <div className="text-xs text-muted mb-2">{tool.category}</div>
        <h1 className="text-2xl md:text-[2rem] font-semibold leading-tight tracking-tight">
          {tool.name}
        </h1>
        <a
          href={tool.url}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="mt-4 no-underline inline-flex items-center gap-1 text-sm hover:text-accent"
        >
          {tool.url} <ExternalLinkIcon size={14} />
        </a>
      </header>

      <dl className="grid gap-6 sm:grid-cols-2 mb-8">
        <div>
          <dt className="text-xs text-muted mb-1">免费额度</dt>
          <dd className="text-sm">{tool.freeTier}</dd>
        </div>
        {tool.pricing && (
          <div>
            <dt className="text-xs text-muted mb-1">定价</dt>
            <dd className="text-sm">{tool.pricing}</dd>
          </div>
        )}
        <div>
          <dt className="text-xs text-muted mb-1">更新时间</dt>
          <dd className="text-sm tabular-nums">{tool.updatedAt}</dd>
        </div>
        {tool.rating !== undefined && (
          <div>
            <dt className="text-xs text-muted mb-1">评分</dt>
            <dd className="text-sm">{tool.rating.toFixed(1)} / 5</dd>
          </div>
        )}
      </dl>

      {tool.description && (
        <div className="prose-content">
          <p>{tool.description}</p>
        </div>
      )}

      {tool.tags && tool.tags.length > 0 && (
        <div className="mt-8 pt-6 border-t border-border flex flex-wrap gap-3">
          {tool.tags.map((t) => (
            <span key={t} className="text-xs text-muted">
              #{t}
            </span>
          ))}
        </div>
      )}

      {tool.reviewPost && (
        <div className="mt-8">
          <Link href={tool.reviewPost} className="text-sm hover:text-accent">
            阅读完整评测 →
          </Link>
        </div>
      )}
    </main>
  );
}
