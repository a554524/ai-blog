import Link from 'next/link';
import type { Post } from '@/lib/types';

type PostCardProps = {
  post: Post;
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="py-8 border-b border-border last:border-0">
      <Link href={`/posts/${post.slug}`} className="no-underline block group">
        <div className="flex items-baseline gap-4 text-xs text-muted mb-2">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          {post.category && <span>{post.category}</span>}
          <span>{post.readingMinutes} 分钟阅读</span>
        </div>
        <h2 className="text-xl font-semibold group-hover:text-accent transition-colors">
          {post.title}
        </h2>
        {post.summary && <p className="mt-2 text-muted text-base">{post.summary}</p>}
        {post.tags && post.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="text-xs text-muted">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </Link>
    </article>
  );
}
