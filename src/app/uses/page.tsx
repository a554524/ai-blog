import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '使用清单',
  description: '日常使用的软硬件、工具与服务。',
};

export default function UsesPage() {
  return (
    <main className="container-prose py-16">
      <h1 className="text-2xl font-semibold mb-4">使用清单</h1>
      <p className="text-muted mb-8">日常使用的软硬件与服务,定期更新。</p>

      <div className="prose-content">
        <h2>开发</h2>
        <ul>
          <li>编辑器:VS Code / Cursor / Claude Code</li>
          <li>终端:tmux + zsh</li>
          <li>字体:Inter(UI) / JetBrains Mono(代码)</li>
        </ul>

        <h2>AI</h2>
        <ul>
          <li>对话:Claude、Kimi、DeepSeek 按任务切换</li>
          <li>编码:Claude Code 做工程,Cursor 做重构</li>
          <li>搜索:Perplexity 查资料</li>
        </ul>

        <h2>博客</h2>
        <ul>
          <li>框架:Next.js 15 + MDX</li>
          <li>样式:Tailwind CSS + OKLCH 色板</li>
          <li>评论:Giscus(GitHub Discussions)</li>
          <li>搜索:Pagefind 构建时索引</li>
          <li>部署:Vercel / Cloudflare Pages</li>
        </ul>
      </div>
    </main>
  );
}
