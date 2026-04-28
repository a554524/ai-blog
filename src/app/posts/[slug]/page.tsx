import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllPosts, getPostBySlug, getRelatedPosts } from '@/lib/posts';
import { renderMDX } from '@/lib/mdx';
import { ArrowRightIcon } from '@/components/icons';
import { site } from '@/lib/site';

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.summary ?? undefined,
    openGraph: {
      title: post.title,
      description: post.summary ?? undefined,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.updated,
      tags: post.tags ? [...post.tags] : undefined,
    },
  };
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default async function PostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const rendered = await renderMDX(post.content);
  const related = getRelatedPosts(post, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.summary,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    author: { '@type': 'Person', name: site.author.name },
    mainEntityOfPage: `${site.url.replace(/\/$/, '')}/posts/${post.slug}`,
  };

  return (
    <main className="container-prose py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article>
        <header className="mb-10 pb-8 border-b border-border">
          <div className="flex flex-wrap items-center gap-4 text-xs text-muted mb-4">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            {post.category && <span>{post.category}</span>}
            <span>{post.readingMinutes} 分钟阅读</span>
            <span>{post.wordCount} 字</span>
          </div>
          <h1 className="text-2xl md:text-[2rem] font-semibold leading-tight tracking-tight">
            {post.title}
          </h1>
          {post.summary && <p className="mt-4 text-muted">{post.summary}</p>}
        </header>

        <div className="prose-content">{rendered}</div>

        {post.tags && post.tags.length > 0 && (
          <div className="mt-12 pt-8 border-t border-border flex flex-wrap gap-3">
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={`/tags/${encodeURIComponent(tag)}`}
                className="no-underline text-xs text-muted hover:text-accent"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}
      </article>

      {related.length > 0 && (
        <aside className="mt-16 pt-8 border-t border-border">
          <h2 className="text-base font-semibold mb-4">相关文章</h2>
          <ul className="space-y-3">
            {related.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/posts/${r.slug}`}
                  className="no-underline inline-flex items-center gap-2 hover:text-accent"
                >
                  <ArrowRightIcon size={14} />
                  <span>{r.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      )}
    </main>
  );
}
