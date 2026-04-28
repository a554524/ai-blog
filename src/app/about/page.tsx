import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '关于',
  description: '关于这个博客与作者。',
};

export default function AboutPage() {
  return (
    <main className="container-prose py-16">
      <h1 className="text-2xl font-semibold mb-8">关于</h1>
      <div className="prose-content">
        <p>你好,我是 mi。</p>
        <p>
          这是一个专注 <strong>AI 实战教程</strong> 与 <strong>免费 AI 工具</strong> 的个人博客。
          内容偏向工程实践,面向想用 AI 提效的开发者与创作者。
        </p>

        <h2>这里有什么</h2>
        <ul>
          <li>Claude Code、Prompt 工程、Agent 开发的实战记录</li>
          <li>定期更新的免费 AI 工具目录,附免费额度与使用建议</li>
          <li>偶尔的工具评测和对比</li>
        </ul>

        <h2>我的原则</h2>
        <ul>
          <li>只写我亲自跑过的内容</li>
          <li>推荐工具必标注免费额度,定期复核</li>
          <li>页面简约、性能优先,尊重阅读体验</li>
        </ul>

        <h2>联系</h2>
        <p>
          若你想交流或反馈错误,欢迎通过文章底部评论留言(基于 GitHub Discussions),或订阅
          RSS 持续关注更新。
        </p>
      </div>
    </main>
  );
}
