# 架构文档

> 配套文档: [PRD.md](./PRD.md)

## 分层

```
┌─────────────────────────────────────┐
│  内容层  content/posts  content/tools │  Markdown/MDX + frontmatter
├─────────────────────────────────────┤
│  数据层  src/lib                     │  读取、解析、索引、排序、筛选
├─────────────────────────────────────┤
│  展示层  src/app  src/components     │  Server Components 为主
├─────────────────────────────────────┤
│  样式层  tailwind + tokens           │  OKLCH + 8px 网格
└─────────────────────────────────────┘

外部: Giscus (评论) · Pagefind (搜索) · Vercel (部署) · Cloudflare Analytics
```

## 关键原则

1. **Server Components 优先**: 减少客户端 JS,首页/文章页默认服务端渲染
2. **客户端组件最小化**: 仅主题切换、搜索框、TOC 高亮等必要交互
3. **构建时生成**: 所有路由 SSG,RSS/Sitemap/Pagefind 索引在构建时产出
4. **零数据库**: Markdown 文件 = 数据源,Git 提交 = 发布流程
5. **按需加载**: 评论区用 IntersectionObserver 懒加载,代码高亮用 Shiki SSR

## 路由映射

| URL | 实现 | 数据源 |
|-----|------|--------|
| `/` | `app/page.tsx` | 最新 N 篇文章 |
| `/posts` | `app/posts/page.tsx` | 全部文章分页 |
| `/posts/[slug]` | `app/posts/[slug]/page.tsx` | `content/posts/*.mdx` |
| `/categories/[slug]` | `app/categories/[slug]/page.tsx` | 按分类筛选 |
| `/tags/[slug]` | `app/tags/[slug]/page.tsx` | 按标签筛选 |
| `/archive` | `app/archive/page.tsx` | 按年月分组 |
| `/tools` | `app/tools/page.tsx` | `content/tools/*.md` |
| `/tools/[slug]` | `app/tools/[slug]/page.tsx` | 同上 |
| `/about` `/uses` | `app/about/page.tsx` 等 | 静态 |
| `/rss.xml` | `app/rss.xml/route.ts` | 构建时生成 |
| `/sitemap.xml` | `app/sitemap.ts` | Next.js 原生 |

## 数据层约定 (src/lib)

```
src/lib/
├── posts.ts          getAllPosts / getPostBySlug / getPostsByTag / getPostsByCategory
├── tools.ts          getAllTools / getToolBySlug / getToolsByCategory
├── mdx.ts            MDX 编译 + Shiki 高亮
├── site.ts           站点常量 (name, url, author)
└── types.ts          Post / Tool / Category 类型
```

所有数据加载函数都是纯函数,接受文件系统内容,返回类型化对象,便于单元测试。

## 阶段路线

- [x] 阶段 0: 仓库 + 脚手架
- [ ] 阶段 1: 设计令牌 + 全局样式
- [ ] 阶段 2: MDX 管线 + 布局骨架
- [ ] 阶段 3: 核心页面 (首页/列表/详情)
- [ ] 阶段 4: 分类/标签/归档
- [ ] 阶段 5: AI 工具目录
- [ ] 阶段 6: 搜索/RSS/SEO
- [ ] 阶段 7: 静态页 + 部署
