# AI 技术博客 · 产品需求文档 (PRD)

> 版本: **v1.2**
> 日期: 2026-04-28
> 作者: mi
> 状态: Draft,待评审
>
> **修订历史**
> - v1.2 (2026-04-28): 澄清登录定位 —— 登录仅服务于评论,不做会员/收藏/付费。v1 坚持 Giscus (GitHub OAuth),多渠道登录列为 v2/v3 预留,避免过度工程化。
> - v1.1 (2026-04-28): 新增第 7.0 节「四条硬性原则」(简约/简洁/工整/排版合理);收紧 4.10 性能目标 (LCP<2.0s / Lighthouse≥98 / JS<90KB);第 10 章验收标准拆分为 5 类可检测项。
> - v1.0 (2026-04-28): 首版。

---

## 1. 项目背景与目标

### 1.1 背景

AI 工具百花齐放,但中文圈存在两个痛点:
- **免费 AI 资源分散**: 优质免费工具/额度/镜像站信息碎片化,新手难以筛选。
- **上手教程稀缺**: 大多数中文教程停留在"注册即用",缺乏工作流级别的实战教学。

### 1.2 目标

建设一个**个人 AI 技术博客**,定位"**教程 + 免费 AI 工具推荐**"双轮驱动:
- **主内容**: 原创 AI 实战教程 (Claude Code、Prompt、Agent、LLM 应用开发等)
- **工具站**: 独立的免费 AI 工具目录页 (分类、标签、筛选、定期更新)
- **订阅沉淀**: RSS + Newsletter 让读者持续追踪更新

### 1.3 非目标 (Out of Scope)

- 不做多作者协作平台 (单人博客)
- 不做付费内容/会员体系 (v1 阶段)
- 不做 UGC 社区 (评论除外)
- 不做后台 CMS (Markdown 文件驱动)

### 1.4 核心指标 (成功标准)

| 指标 | 3 个月 | 6 个月 | 12 个月 |
|------|--------|--------|---------|
| 月活读者 (UV) | 1,000 | 5,000 | 20,000 |
| 文章数 | 15 | 40 | 100 |
| AI 工具收录 | 30 | 80 | 200 |
| Newsletter 订阅 | 50 | 300 | 1,500 |
| Lighthouse 性能 | ≥ 95 | ≥ 95 | ≥ 95 |

---

## 2. 目标用户

### 2.1 用户画像

**主要用户 (P0)**
- AI 应用开发者 / 独立开发者
- 想用 AI 提效但不知从何下手的技术人
- 内容创作者、产品经理 (非开发但想用 AI)

**次要用户 (P1)**
- 学生、AI 初学者
- 被搜索引擎引流进来的偶然访客

### 2.2 核心场景

1. **搜索着陆**: 从 Google/Bing 搜 "Claude Code 教程" 落到某篇文章,读完想看更多 → 进入首页/分类页
2. **工具发现**: 想找"免费的 AI 绘图工具",到工具目录筛选 → 点击外链试用 → 回来读博主的评测文
3. **订阅追更**: 认可博主内容,加 RSS/Newsletter → 定期回访
4. **分享传播**: 读到好文章,复制链接分享到微信/X/微博

---

## 3. 技术栈决策

已确认 (前置问答):

| 层 | 选型 | 理由 |
|----|------|------|
| 框架 | **Next.js 15 (App Router) + MDX** | React 生态,SSG/ISR,SEO 友好,支持交互组件 |
| 内容 | **Markdown/MDX + Git** | 版本控制,本地写作,低运维成本 |
| 样式 | **Tailwind CSS + shadcn/ui** | 主流组合,设计一致性,快速迭代 |
| 部署 | **Vercel (主) / Cloudflare Pages (备)** | 免费额度够个人用,自动 CI |
| 域名 | 自购 (如 `.dev` / `.ai` / `.com`) | ~¥60-200/年,唯一硬性成本 |

### 3.1 关键依赖库

- `contentlayer2` 或 `next-mdx-remote` — MDX 内容管理
- `shiki` — 代码高亮 (比 Prism 更好看,Next 官方推荐)
- `rehype-slug` + `rehype-autolink-headings` — 标题锚点
- `remark-gfm` — GitHub 风格 Markdown
- `reading-time` — 阅读时长估算
- `next-seo` — SEO 元信息
- `next-themes` — 深色模式
- `pagefind` — 本地全文搜索 (零运维,构建时生成索引)
- `giscus` — GitHub Discussions 评论
- `umami-cloud` 或 `cloudflare-web-analytics` — 免费访问统计

---

## 4. 功能需求

### 4.1 内容展示 (P0 · 必须)

#### 4.1.1 文章页
- Markdown/MDX 渲染,支持代码块高亮、表格、图片、注脚
- **代码块**: Shiki 高亮 + 一键复制 + 语言标识 + 行号可选
- **目录 (TOC)**: 右侧悬浮,滚动高亮当前章节,移动端收起
- **元信息**: 标题、发布日期、更新日期、阅读时长、字数、标签、分类、作者
- **封面图**: 支持 Open Graph 图片 (分享卡片)
- **相关文章**: 同标签/同分类推荐,文章底部展示 3-5 篇
- **上下篇导航**: 按时间顺序
- **分享按钮**: 微信、X/Twitter、复制链接
- **版权声明**: 底部固定 CC BY-NC-SA 或自定义
- **MDX 自定义组件**: 支持嵌入 `<Callout>`, `<Video>`, `<ToolCard>`, `<Comparison>` 等

#### 4.1.2 首页
- Hero 区: 博客定位 + 订阅入口
- 最新文章 (6-10 篇,卡片式,含封面/摘要)
- 精选教程系列 (Pinned/Featured)
- 热门 AI 工具 (从工具目录摘 4-6 个)
- Newsletter 订阅 CTA

#### 4.1.3 列表页
- **按分类**: `/categories/[slug]`
- **按标签**: `/tags/[slug]`
- **归档页**: `/archive` — 按年月倒序,一屏看全站
- **分页**: 每页 10-15 篇,URL 含页码 (SEO)

### 4.2 AI 工具目录 (P0 · 特色功能)

#### 4.2.1 工具列表页 `/tools`
- **卡片展示**: Logo、名称、一句话介绍、标签、免费额度说明、外链
- **筛选**:
  - 分类 (对话、绘图、代码、视频、音频、Agent、API、其他)
  - 标签 (国产、需梯子、完全免费、有免费额度、开源)
  - 搜索 (按名称/介绍)
- **排序**: 最新收录 / 热度 / 字母
- **视图**: 卡片 / 表格切换

#### 4.2.2 工具详情页 `/tools/[slug]`
- 基础信息 (同卡片字段,扩展)
- 免费额度详情、注册难度、付费门槛
- 博主评测 (可选,链到对应评测文章)
- 截图 / 演示 GIF
- 使用场景、替代品
- 更新日志 (价格/功能变动)
- 外链 "去试用" 按钮

#### 4.2.3 数据模型
工具条目用独立 Markdown 文件管理 (`content/tools/*.md`),frontmatter:
```yaml
---
slug: claude
name: Claude
logo: /tools/claude.png
url: https://claude.ai
category: chat
tags: [free-tier,需梯子]
freeTier: "每日免费额度,无需信用卡"
pricing: "免费 + Pro $20/月"
rating: 4.8
featured: true
reviewPost: /posts/claude-review  # 可选,关联评测文
updatedAt: 2026-04-20
---
详细介绍 (Markdown)...
```

### 4.3 搜索 (P0)
- **Pagefind 本地全文索引**: 构建时生成,零后端成本
- 顶部搜索栏 (快捷键 `⌘K` / `Ctrl+K`)
- 搜索结果含标题、摘要高亮、分类标签
- 支持中英文分词

### 4.4 评论 + 登录 (P0 · 已合并定义)

> **定位澄清 (v1.1 修订)**: 登录**仅服务于评论**,不做会员/收藏/付费/个人中心。保持博客为"纯静态 + 零后端 + 免费部署"架构。未来如需拓展,按 §5.4 预留钩子升级。

#### 4.4.1 方案: Giscus (推荐,v1 采用)
- 基于 **GitHub Discussions**,评论数据托管在 GitHub
- **登录方式**: 仅 GitHub OAuth (Giscus 原生支持,无需自建)
- 免费、无广告、无追踪、无垃圾评论 (GitHub 账号天然门槛)
- 主题跟随博客深浅色模式
- Markdown 评论、emoji、回复、点赞全部内置
- **代价**: 非技术读者 (中文大众) 可能没有 GitHub 账号,参与门槛略高

#### 4.4.2 可选增强 (P2 · v1 不实现,视评论活跃度再决定)
如果后期发现大量读者因"只能 GitHub 登录"而放弃评论,再按以下顺序补方案:

| 阶段 | 方案 | 新增登录方式 | 架构代价 |
|------|------|------------|---------|
| v1 | Giscus 原生 | GitHub | 零 (当前方案) |
| v2 | **Waline** 替代 Giscus | GitHub + Google + 邮箱 + 匿名 | 需一个免费数据库 (Leancloud/MongoDB Atlas/Supabase 免费层),部署一个 Serverless 函数 |
| v3 | Clerk + 自建评论 | + 微信/QQ/手机号 (需企业资质 + 备案 + 短信) | 重架构,月成本 ¥100+ |

**v1 明确止于 Giscus**,避免过度工程化。方案 v2/v3 在 PRD §5.4 "可扩展性"预留讨论,不列入阶段 1-2 交付。

#### 4.4.3 评论功能要求 (无论用哪个方案都要满足)
- 每篇文章底部嵌入
- 支持 Markdown 和代码块
- 支持回复 (嵌套或引用)
- 支持主题跟随 (日/夜)
- 懒加载 (IntersectionObserver,滚到底部再加载,不拖累 LCP)
- 评论区出错/关闭时有明确 fallback 文案,不能白屏

### 4.5 RSS / Atom / Sitemap (P0)
- `/rss.xml` — 全站 RSS 2.0
- `/atom.xml` — Atom 格式 (备用)
- `/sitemap.xml` — SEO 站点地图
- `/feed/tools.xml` — 工具目录专属 RSS (新工具收录自动推送)
- `/robots.txt` — 爬虫规则

### 4.6 Newsletter 订阅 (P1 · 首期实现)
- **服务**: Buttondown (免费 100 订阅) 或 Resend + 自建列表
- 文章页、首页、独立 `/newsletter` 页面嵌入订阅表单
- 双重确认 (Double Opt-in)
- 订阅者欢迎邮件 (可选,自动化)
- 订阅人数公开展示 (社会证明)

### 4.7 深色模式 (P0)
- 系统跟随 + 手动切换 (日/夜/自动 三态)
- `next-themes` 实现,无闪烁
- 代码块主题跟随 (Shiki 双主题)

### 4.8 SEO (P0)
- 每页独立 `<title>` `<meta description>` `<og:*>` `<twitter:*>`
- 结构化数据 (JSON-LD): `Article`, `BreadcrumbList`, `WebSite`
- 语义化 HTML (`<article>`, `<nav>`, `<main>`, `<time>`)
- 规范的 URL 结构 (`/posts/[slug]`, 纯英文/拼音 slug)
- Canonical URL
- Open Graph 自动生成封面 (`@vercel/og`)
- robots + sitemap

### 4.9 访问统计 (P0)
- **Cloudflare Web Analytics** (完全免费,无 Cookie,GDPR 友好) 或
- **Umami Cloud 免费额度** / 自建 Umami
- 统计: PV/UV、来源、热门页面、停留时长
- 不埋个人身份数据

### 4.10 性能与可访问性 (P0 · 已收紧)
- **Core Web Vitals 目标 (收紧)**:
  - LCP < **2.0s** · INP < **150ms** · CLS < **0.05** · FCP < **1.2s** · TBT < **150ms**
- **Lighthouse**: 性能/可访问性/最佳实践/SEO ≥ **98** (四项)
- **图片**: `next/image` 自动优化,AVIF/WebP,懒加载,显式尺寸,首屏图 `priority`
- **字体**: **仅 1 个字体家族** (正文 + 代码,共 2 个 family 为上限),`font-display: swap`,子集化,预加载关键字重
- **Bundle 预算 (收紧)**:
  - 首页 JS < **90KB** gzipped · CSS < **20KB**
  - 文章页 JS < **120KB** · 工具目录 JS < **140KB**
  - 首屏零第三方脚本阻塞 (评论、统计全部 lazy / afterInteractive)
- **零布局偏移**: 所有图片、嵌入、广告位、字体切换必须预留尺寸
- **可访问性**: WCAG 2.2 AA,键盘导航,焦点可见,对比度 ≥ 4.5:1,reduced-motion 支持

### 4.11 移动端适配 (P0)
- 响应式断点: 320 / 375 / 768 / 1024 / 1440 / 1920
- 移动端导航 (抽屉/底部 tab 二选一)
- 触摸目标 ≥ 44×44px
- 代码块横向滚动
- 字体 `clamp()` 流体排版

### 4.12 内容创作工作流 (P0 · 作者侧)
- **本地写作**: VS Code / Obsidian + Markdown
- **分支流程**:
  - `draft/xxx` 分支写作 → PR 自动部署 Preview → 合并 main 自动发布生产
- **Front Matter 模板**:
  ```yaml
  ---
  title: "文章标题"
  slug: "article-slug"
  date: 2026-04-28
  updated: 2026-04-28
  category: "tutorial"
  tags: ["claude", "agent"]
  summary: "150 字以内摘要"
  cover: "/covers/xxx.jpg"
  draft: false
  featured: false
  ---
  ```
- **图片管理**: `public/images/posts/[slug]/` 按文章分目录
- **脚本**: `pnpm new-post <slug>` 一键生成模板文件

### 4.13 作者 / 关于页 (P0)
- `/about` — 个人简介、技术栈、联系方式
- `/uses` — 使用的工具/硬件/软件清单 (极客风)
- `/now` — 现在在做什么 (nownownow.com 风格,可选)

---

## 5. 非功能需求

### 5.1 安全
- 无用户登录,无后端,无数据库 → 攻击面极小
- 评论用 Giscus 托管,GitHub 自带反滥用
- 订阅表单需防垃圾 (honeypot 字段 + 速率限制)
- 所有外链 `rel="noopener noreferrer"`,高风险 `nofollow`
- CSP 头限制外部资源 (Cloudflare Headers 配置)
- HTTPS 强制,HSTS 启用

### 5.2 性能预算
见 4.10。

### 5.3 可维护性
- 文章 / 工具全部 Markdown 驱动,零数据库依赖
- 模块化组件,单文件 ≤ 400 行
- TypeScript 严格模式,无 `any` 漏出
- ESLint + Prettier + Stylelint + tsc 全套 PostToolUse 钩子
- 关键逻辑单元测试覆盖 ≥ 80% (解析、路由生成、RSS 生成)
- Playwright 视觉回归 (首页、文章页、工具页在 320/768/1440)

### 5.4 可扩展性 (预留钩子,不在 v1 实现)
- 付费内容门 (Paywall)
- 多作者协作 (git 权限已够,无需代码改造)
- i18n 中英双语 (目录结构预留 `/en/*`,v1 不启用)
- 评论迁移 (Giscus 数据导出兼容)

### 5.5 合规
- 隐私: 无个人数据采集,分析工具无 Cookie
- 底部固定 `/privacy` `/terms` 页
- ICP 备案 (若国内访问量大后,上国内 CDN 再备)

---

## 6. 信息架构与 URL 结构

```
/                              首页
/posts                         文章列表 (最新)
/posts/[slug]                  文章详情
/categories/[slug]             分类页
/tags/[slug]                   标签页
/archive                       归档
/tools                         AI 工具目录
/tools/[slug]                  工具详情
/series/[slug]                 系列文章合集 (多篇文章绑定一个系列)
/about                         关于
/uses                          使用清单
/newsletter                    订阅页
/search                        搜索页 (Pagefind)
/rss.xml · /atom.xml · /sitemap.xml · /robots.txt
```

---

## 7. 设计风格约束

### 7.0 四条硬性原则 (用户强要求,最高优先级)

这四条压倒一切其他设计选择。任何 PR 合并前必须逐项过检。

#### 7.0.1 简约 (Minimal)
- **内容密度 > 装饰密度**: 每个元素必须服务于阅读或导航,否则删除
- **禁用**: 不必要的插图、装饰性分隔线、多余图标、emoji 堆砌、渐变色块、背景花纹
- **单页元素预算**:
  - 首页: 1 个 Hero 区 + 1 个文章列表 + 1 个订阅 CTA,**不超过 3 个主要板块**
  - 文章页: 正文为主,侧栏只允许 TOC,**最多 2 个辅助组件** (分享/相关文章任选其一放底部)
  - 工具目录: 筛选 + 卡片列表,**无其他装饰**
- **色彩约束**: 整站主色 ≤ 2 种 (1 主色 + 1 强调色),中性灰阶作骨架
- **图标**: 统一一套 (Lucide 或 Heroicons 二选一,**不混用**),线性风格,尺寸统一

#### 7.0.2 简洁 (Clean)
- **字体家族**: 正文 1 个 + 代码 1 个,**上限 2 个 family**,全站字重不超过 3 档 (如 400/500/700)
- **字号阶梯**: 最多 6 级 (12/14/16/18/24/32,或 clamp 流体版本),不得随意加字号
- **圆角统一**: 全站 2-3 个圆角尺寸 (如 4px/8px/12px),不允许每个组件自定义
- **阴影统一**: 最多 2 级阴影 (弱/强),或**完全不用阴影** (推荐,用边框代替)
- **禁用视觉噪音**:
  - 无多重边框 (border + shadow + outline 同时出现)
  - 无彩色文字强调 (加粗或背景高亮足够)
  - 无动态背景、视差、粒子效果

#### 7.0.3 工整 (Aligned)
- **8px 基线网格**: 所有间距为 8 的倍数 (4/8/12/16/24/32/48/64)
- **12 列栅格**: 桌面端主栅格 12 列,gap 24px,最大内容宽度 **720px** (文章) / **1200px** (目录/首页)
- **垂直节奏**: 正文行高 1.7,段落间距 = 1 个行高,标题上下间距按 1.5× / 0.5× 规则
- **对齐规则**:
  - 所有文本默认**左对齐**,不用居中堆砌 (Hero 大标题例外,且只允许 1 处)
  - 同一列表卡片高度一致 (flex/grid 拉齐),不允许参差
  - 图片说明与图片同宽,不悬挂
- **边距对称**: 页面左右内边距相等,响应式下按断点统一跳档 (16/24/32/48)

#### 7.0.4 排版合理 (Typographic)
- **正文**: 16px(移动) / 18px(桌面),行高 1.7,段宽 **60-75 字符** (中文约 30-38 字)
- **标题层级清晰**:
  - H1 仅 1 个 (文章标题)
  - H2 大节,H3 小节,**不超过 H4**,不允许跳级 (H2 后不能直接 H4)
- **中英文混排**:
  - 中英文间**自动空格** (`pangu.js` 或构建时处理)
  - 中文引号 `「」`,英文引号 `""`,不混用
- **代码块**: 等宽字体,行高 1.5,横向滚动不换行,语言标签右上角
- **链接可识别**: 正文链接必须有下划线 (或明确视觉区分),不靠纯颜色
- **禁止**: 两端对齐 (中英混排会炸)、首行缩进 (Web 不用)、斜体中文 (不好看)

### 7.1 反模板检查 (沿用 design-quality.md)

- **禁止**: shadcn 默认卡片堆叠、泛泛的"clean minimal 空壳"
- **方向**: 在"简约"前提下,倾向 **Swiss / International** 风 (网格严格、信息密度适中、无装饰)
  - Editorial 杂志风作为备选,但要克制大字标题数量
  - **不采用** Neo-Brutalism (与简约冲突)
- **色板**: OKLCH 定义,日/夜 tokens 对齐
- **动效**: 仅 `transform` / `opacity`,时长 ≤ 200ms,尊重 `prefers-reduced-motion`
- **上线前检查清单**: 7.0 四节全部 ✅ 才能合并

---

## 8. 里程碑与交付节奏

### 阶段 0 · 立项 (本周, 1-2 天)
- [x] PRD 确认
- [ ] 仓库初始化 (`ai-blog`)
- [ ] 技术选型 POC (Next.js + Contentlayer / next-mdx-remote 二选一)
- [ ] 域名选购

### 阶段 1 · MVP (2 周)
- [ ] 框架脚手架 + Tailwind + shadcn + next-themes
- [ ] 文章渲染 (Markdown/MDX + Shiki + TOC)
- [ ] 首页 + 文章列表 + 文章详情 + 标签/分类
- [ ] 深色模式 + 响应式
- [ ] SEO 基础 (meta + sitemap + RSS)
- [ ] 部署 Vercel + 域名
- [ ] 首篇文章上线

### 阶段 2 · 特色功能 (2 周)
- [ ] AI 工具目录 (列表 + 详情 + 筛选)
- [ ] Pagefind 搜索
- [ ] Giscus 评论
- [ ] Newsletter 订阅接入
- [ ] OG 图片自动生成
- [ ] Cloudflare Web Analytics 接入

### 阶段 3 · 打磨与增长 (持续)
- [ ] Lighthouse 95+ 全绿
- [ ] 视觉回归测试 + CI
- [ ] 归档页、系列页、uses 页
- [ ] 首月 5-10 篇种子文章
- [ ] 工具目录种子 30+ 条

---

## 9. 风险与对策

| 风险 | 等级 | 对策 |
|------|------|------|
| 写作频次低导致博客"死站" | 高 | 阶段 3 结束前屯好 10 篇存稿;Newsletter 承诺"双周更" |
| 工具目录信息过期 | 高 | 每条工具加 `updatedAt`,半年未更新顶部挂"可能过期"提示;季度人工复核 |
| Vercel 免费额度超限 | 低 | 国内流量走 Cloudflare Pages 镜像;静态站压力极小 |
| SEO 冷启动慢 | 中 | 发文同步提交搜索引擎;X/微博/小报童导流;交换友链 |
| 评论垃圾 | 低 | Giscus GitHub 登录天然过滤 |
| 内容版权 | 中 | 所有引用注明来源;图片用自制或 CC0;AI 生图标注工具 |

---

## 10. 验收标准 (阶段 1 MVP)

### 10.1 性能 (流畅)
- [ ] 首页 LCP < **2.0s** (4G 节流),FCP < 1.2s,CLS < 0.05,INP < 150ms
- [ ] Lighthouse 四项 ≥ **98**
- [ ] 首页 JS bundle ≤ 90KB gzipped,CSS ≤ 20KB
- [ ] 滚动帧率 ≥ 60fps (Chrome DevTools Performance 面板验证)
- [ ] 首屏零第三方脚本阻塞

### 10.2 简约 / 简洁
- [ ] 首页主要板块 ≤ 3 个
- [ ] 全站字体 family ≤ 2 个,字重 ≤ 3 档,字号阶梯 ≤ 6 级
- [ ] 全站圆角规格 ≤ 3 种,阴影规格 ≤ 2 种
- [ ] 图标仅使用一套库,线性风格统一
- [ ] 无装饰性元素 (渐变色块、背景花纹、粒子、视差) 抽查通过

### 10.3 工整 (布局)
- [ ] 所有间距为 8 的倍数 (Stylelint 自定义规则 + 人工抽查)
- [ ] 文章正文最大宽度 720px,列表/目录 1200px
- [ ] 同列卡片高度对齐,视觉回归基线通过 (320/768/1440)
- [ ] 响应式断点跳档间距统一

### 10.4 排版合理
- [ ] 正文行高 1.7,段宽 60-75 字符
- [ ] 标题层级不跳级,H1 每页唯一
- [ ] 中英文自动空格生效 (抽 3 篇文章检查)
- [ ] 链接有明确下划线或视觉区分,非纯色差

### 10.5 其他
- [ ] 文章页在 320/768/1440 视觉无溢出
- [ ] 深色模式无闪烁 (FOUC)
- [ ] RSS 在 Feedly/Inoreader 正确渲染
- [ ] sitemap 提交 Google Search Console 无错误
- [ ] 发布一篇 2000+ 字带代码块的真实文章,所有功能串通

---

## 11. 开放问题 (待决策)

1. **域名**: 倾向 `.dev` / `.ai` / `.com` / `.io`? 预算上限?
2. **博客名**: 中英文?品牌化程度?(例如 "AI Lab" / "某某的 AI 笔记" / 个人名)
3. **Newsletter 工具**: Buttondown vs Resend vs 自建 (v1 建议 Buttondown)
4. **视觉方向**: Editorial / Neo-Brutalism / Swiss 三选一,需要先出一版 Figma 或 HTML 草图
5. **是否预留付费**: 未来是否做付费内容?若是,v1 需预留会员系统钩子
6. **国内访问**: 是否需要国内镜像/备案? (若 80%+ 读者在国内,建议阶段 3 上)
7. **评论参与率**: Giscus 上线后观察 1-2 个月,若因 GitHub 门槛导致中文读者放弃评论,触发 v2 升级 (Waline 多渠道登录)。触发阈值建议:月评论数 < 5 条 且 有 ≥ 3 条读者反馈"登录不了"

---

## 12. 附录

### 12.1 参考站点
- [overreacted.io](https://overreacted.io) — Dan Abramov,Next.js + MDX 极简教程风
- [leerob.io](https://leerob.io) — 现代 Next.js 博客基准
- [shadcn.com](https://ui.shadcn.com) — shadcn/ui 文档风
- [theresanaiforthat.com](https://theresanaiforthat.com) — AI 工具目录参考
- [futurepedia.io](https://www.futurepedia.io) — AI 工具目录参考

### 12.2 相关全局规则
- `~/.claude/rules/web/design-quality.md` — 反模板政策
- `~/.claude/rules/web/performance.md` — 性能预算
- `~/.claude/rules/web/security.md` — CSP / XSS
- `~/.claude/rules/web/testing.md` — 视觉回归 / E2E
- `~/.claude/rules/common/development-workflow.md` — 研究先行 · TDD · 代码审查

---

**下一步**: 若本 PRD 确认,进入阶段 0:仓库初始化 + POC 技术选型 (Contentlayer vs next-mdx-remote)。
