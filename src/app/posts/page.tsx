import type { Metadata } from 'next';
import { getAllPosts } from '@/lib/posts';
import { PostCard } from '@/components/post-card';

export const metadata: Metadata = {
  title: '文章',
  description: '全部文章列表。',
};

export default function PostsIndexPage() {
  const posts = getAllPosts();
  return (
    <main className="container-page py-16">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold">文章</h1>
        <p className="mt-2 text-muted text-sm">共 {posts.length} 篇</p>
      </header>
      {posts.length === 0 ? (
        <p className="text-muted py-8">暂无文章。</p>
      ) : (
        posts.map((p) => <PostCard key={p.slug} post={p} />)
      )}
    </main>
  );
}
