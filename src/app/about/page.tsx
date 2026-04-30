import type { Metadata } from 'next';
import Image from 'next/image';
import { ExternalLinkIcon } from '@/components/icons';

export const metadata: Metadata = {
  title: '关于',
  description: '关于这个博客与作者 —— 专注 AI 实战教程与免费 AI 工具推荐。',
};

export default function AboutPage() {
  return (
    <main className="container-prose py-16">
      {/* 标题区 */}
      <header className="mb-12 pb-8 border-b border-border">
        <div className="text-sm text-muted mb-2">关于</div>
        <h1 className="text-2xl md:text-[2rem] font-semibold leading-tight tracking-tight">
          你好,我是 mi
        </h1>
        <p className="mt-4 text-muted">
          独立开发者 · 坐标江苏南京 · 专注 AI 工程实践
        </p>
      </header>

      {/* 博客定位 */}
      <section className="prose-content">
        <h2>这个博客在做什么</h2>
        <p>
          专注 <strong>AI 实战教程</strong> 与 <strong>免费 AI 工具整理</strong>,
          面向想用 AI 提效的开发者与创作者。不写营销,不堆概念,只写我亲自跑通、
          踩过坑的内容。
        </p>

        <h2>你能在这里找到</h2>
        <ul>
          <li>Claude Code、Prompt 工程、Agent 开发的实战记录</li>
          <li>定期更新的免费 AI 工具目录,附免费额度与使用建议</li>
          <li>从零搭建到上线的完整工程流水账</li>
          <li>偶尔的工具评测与横向对比</li>
        </ul>

        <h2>我的原则</h2>
        <ul>
          <li>只写亲自跑通的内容,不复述官方文档</li>
          <li>推荐工具必标注免费额度,每季度复核一次</li>
          <li>页面简约、性能优先,尊重阅读体验</li>
          <li>所有内容 CC BY-NC-SA 4.0,欢迎署名转载</li>
        </ul>
      </section>

      {/* 微信联系区 */}
      <section
        id="contact"
        aria-label="联系方式"
        className="mt-16 pt-8 border-t border-border"
      >
        <h2 className="text-xl font-semibold mb-6">聊聊</h2>

        <div className="border border-border rounded-lg p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-10">
            <div className="flex-1 order-2 md:order-1">
              <div className="text-xs text-muted mb-2">首选 · 微信</div>
              <div className="font-semibold text-lg mb-3">天空一声响</div>
              <p className="text-muted text-sm md:text-base max-w-prose">
                最直接的交流方式。欢迎技术人、独立开发者、AI 折腾爱好者。
                加好友时请注明来自博客,我通过更快。
              </p>
              <p className="text-muted text-sm md:text-base max-w-prose mt-3">
                聊什么都可以:Claude Code 配置、Agent 架构选型、Prompt 工程、
                AI 工具踩坑、独立开发、南京同行见面。
              </p>
            </div>

            <div className="order-1 md:order-2 shrink-0 self-center">
              <div className="inline-block rounded border border-border p-2 bg-surface">
                <Image
                  src="/images/wechat-qr.jpg"
                  alt="微信二维码 - 天空一声响"
                  width={200}
                  height={200}
                  className="block"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 其他联系方式 */}
        <div className="mt-8">
          <div className="text-xs text-muted mb-3">其他渠道</div>
          <ul className="space-y-3">
            <li className="flex items-baseline gap-4">
              <span className="text-sm text-muted w-24 shrink-0">文章评论</span>
              <span className="text-sm">
                每篇文章底部支持 GitHub 账号评论(基于 Giscus)
              </span>
            </li>
            <li className="flex items-baseline gap-4">
              <span className="text-sm text-muted w-24 shrink-0">GitHub</span>
              <a
                href="https://github.com/a554524/ai-blog"
                target="_blank"
                rel="noopener noreferrer"
                className="no-underline inline-flex items-baseline gap-1 text-sm hover:text-accent"
              >
                a554524/ai-blog <ExternalLinkIcon size={12} />
              </a>
            </li>
            <li className="flex items-baseline gap-4">
              <span className="text-sm text-muted w-24 shrink-0">RSS 订阅</span>
              <a
                href="/rss.xml"
                className="no-underline text-sm hover:text-accent"
              >
                /rss.xml
              </a>
            </li>
          </ul>
        </div>

        <p className="mt-10 text-xs text-muted">
          不接广告、不接代写、不做付费推广。技术交流不收钱,商单请先加微信说清楚。
        </p>
      </section>
    </main>
  );
}
