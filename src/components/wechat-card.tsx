import Image from 'next/image';

/**
 * 首页微信交流卡
 * - 遵循 PRD §7.0 简约/简洁/工整/排版合理四条硬约束
 * - 桌面:二维码在右,文字在左,单行平铺
 * - 移动:二维码在上,文字在下,垂直堆叠
 * - 无装饰渐变/阴影,仅一条边框
 */
export function WechatCard() {
  return (
    <section
      aria-label="微信交流"
      className="my-16 border border-border rounded-lg p-6 md:p-8"
    >
      <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
        <div className="flex-1 order-2 md:order-1">
          <div className="text-xs text-muted mb-2">加我微信</div>
          <h2 className="text-xl md:text-2xl font-semibold tracking-tight mb-3">
            想聊 AI 技术?扫码加我
          </h2>
          <p className="text-muted text-sm md:text-base max-w-prose">
            欢迎技术人、独立开发者、AI 折腾爱好者直接加好友。
            留言说明来自博客,聊 Claude Code、Agent 架构、Prompt 工程、
            AI 工具避坑,或者单纯认识一下都行。
          </p>
          <div className="mt-4 text-xs text-muted">
            微信号:天空一声响 · 江苏南京
          </div>
        </div>

        <div className="order-1 md:order-2 shrink-0 self-center">
          <div className="inline-block rounded border border-border p-2 bg-surface">
            <Image
              src="/images/wechat-qr.jpg"
              alt="微信二维码"
              width={180}
              height={180}
              className="block"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
