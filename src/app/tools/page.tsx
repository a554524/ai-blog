import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getAllTools, getToolCategories, getToolTags } from '@/lib/tools';
import { ToolsFilter } from '@/components/tools-filter';

export const metadata: Metadata = {
  title: 'AI 工具目录',
  description: '精选免费或有免费额度的 AI 工具,定期更新。',
};

export default function ToolsPage() {
  const tools = getAllTools();
  const categories = getToolCategories();
  const tags = getToolTags();

  return (
    <main className="container-page py-16">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold">AI 工具目录</h1>
        <p className="mt-2 text-muted text-sm">
          精选免费或有免费额度的 AI 工具,定期复核 · 共 {tools.length} 个
        </p>
      </header>
      <Suspense fallback={<p className="text-muted">加载中…</p>}>
        <ToolsFilter tools={tools} categories={categories} tags={tags} />
      </Suspense>
    </main>
  );
}
