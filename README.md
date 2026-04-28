# AI 技术博客

> 分享 AI 实战教程与免费 AI 工具推荐。

## 快速开始

```bash
npm install
npm run dev
```

打开 http://localhost:3000。

## 目录结构

```
ai-blog/
├── docs/                PRD、架构文档
├── content/
│   ├── posts/           文章 (Markdown/MDX)
│   └── tools/           AI 工具条目
├── public/              静态资源
├── src/
│   ├── app/             Next.js App Router 页面
│   ├── components/      UI 组件
│   ├── lib/             工具函数、数据加载
│   └── styles/          全局样式与设计令牌
└── ...                  Next/TS/Tailwind/ESLint/Prettier 配置
```

## 技术栈

- Next.js 15 (App Router) + React 19 + TypeScript strict
- Tailwind CSS 3.4 + OKLCH 色板 + 8px 基线网格
- Markdown/MDX 内容驱动,零数据库
- Giscus 评论 (GitHub Discussions)
- Pagefind 本地全文搜索
- Vercel / Cloudflare Pages 免费部署

## 设计约束

见 [docs/PRD.md §7.0](docs/PRD.md) —— 简约 / 简洁 / 工整 / 排版合理四条硬约束。

## 性能目标

- Lighthouse 四项 ≥ 98
- LCP < 2.0s · INP < 150ms · CLS < 0.05
- 首页 JS < 90KB gzipped
