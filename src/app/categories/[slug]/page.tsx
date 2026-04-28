import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllCategories, getPostsByCategory } from '@/lib/posts';
import { PostCard } from '@/components/post-card';

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getAllCategories().map((c) => ({ slug: encodeURIComponent(c.category) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = decodeURIComponent(slug);
  return { title: category, description: `分类「${category}」下的全部文章。` };
}

export default async function CategoryPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const category = decodeURIComponent(slug);
  const posts = getPostsByCategory(category);
  if (posts.length === 0) notFound();

  return (
    <main className="container-page py-16">
      <header className="mb-8">
        <div className="text-sm text-muted">分类</div>
        <h1 className="text-2xl font-semibold mt-1">{category}</h1>
        <p className="mt-2 text-muted text-sm">共 {posts.length} 篇</p>
      </header>
      {posts.map((p) => (
        <PostCard key={p.slug} post={p} />
      ))}
    </main>
  );
}
