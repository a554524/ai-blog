import Link from 'next/link';
import { getAllPosts } from '@/lib/posts';
import { PostCard } from '@/components/post-card';
import { ArrowRightIcon } from '@/components/icons';
import { site } from '@/lib/site';

export default function HomePage() {
  const posts = getAllPosts().slice(0, 6);

  return (
    <main className="container-page">
      {/* 板块 1:Hero */}
      <section className="py-24 md:py-32 border-b border-border">
        <h1 className="text-2xl md:text-[2.5rem] font-semibold leading-tight tracking-tight max-w-prose">
          {site.tagline}
        </h1>
        <p className="mt-6 text-muted max-w-prose">{site.description}</p>
        <div className="mt-8 flex items-center gap-6 text-sm">
          <Link href="/posts" className="no-underline inline-flex items-center gap-1 hover:text-accent">
            浏览文章 <ArrowRightIcon size={16} />
          </Link>
          <Link href="/tools" className="no-underline inline-flex items-center gap-1 hover:text-accent">
            AI 工具目录 <ArrowRightIcon size={16} />
          </Link>
        </div>
      </section>

      {/* 板块 2:最新文章 */}
      <section className="py-16">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-xl font-semibold">最新文章</h2>
          <Link href="/posts" className="no-underline text-sm text-muted hover:text-fg">
            查看全部
          </Link>
        </div>
        <div>
          {posts.length === 0 ? (
            <p className="text-muted py-8">暂无文章。</p>
          ) : (
            posts.map((p) => <PostCard key={p.slug} post={p} />)
          )}
        </div>
      </section>
    </main>
  );
}
