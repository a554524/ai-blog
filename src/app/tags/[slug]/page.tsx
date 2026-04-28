import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllTags, getPostsByTag } from '@/lib/posts';
import { PostCard } from '@/components/post-card';

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getAllTags().map((t) => ({ slug: encodeURIComponent(t.tag) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tag = decodeURIComponent(slug);
  return { title: `#${tag}`, description: `标签「${tag}」下的全部文章。` };
}

export default async function TagPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const tag = decodeURIComponent(slug);
  const posts = getPostsByTag(tag);
  if (posts.length === 0) notFound();

  return (
    <main className="container-page py-16">
      <header className="mb-8">
        <div className="text-sm text-muted">标签</div>
        <h1 className="text-2xl font-semibold mt-1">#{tag}</h1>
        <p className="mt-2 text-muted text-sm">共 {posts.length} 篇</p>
      </header>
      {posts.map((p) => (
        <PostCard key={p.slug} post={p} />
      ))}
    </main>
  );
}
