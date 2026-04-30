'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { CloseIcon } from './icons';

const STORAGE_KEY = 'floating-wechat-collapsed';

/**
 * 桌面端右侧悬浮微信卡
 * - 仅在 md 以上显示,移动端依赖首页 WechatCard
 * - 可收起折叠成小图标,状态写 localStorage
 * - 克制:无阴影,仅 1 条边框 + 1 个 backdrop-blur
 */
export function FloatingWechat() {
  const [collapsed, setCollapsed] = useState<boolean | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    setCollapsed(stored === '1');
  }, []);

  if (collapsed === null) return null;

  const toggle = (next: boolean) => {
    setCollapsed(next);
    localStorage.setItem(STORAGE_KEY, next ? '1' : '0');
  };

  return (
    <div
      aria-label="加微信交流"
      className="hidden md:block fixed right-6 top-32 z-30"
    >
      {collapsed ? (
        <button
          type="button"
          onClick={() => toggle(false)}
          aria-label="展开微信卡片"
          className="block rounded border border-border bg-bg/90 backdrop-blur p-2 hover:border-fg/40 transition-colors"
        >
          <Image
            src="/images/wechat-qr.jpg"
            alt=""
            width={48}
            height={48}
            className="block rounded"
          />
        </button>
      ) : (
        <aside className="w-56 rounded-lg border border-border bg-bg/90 backdrop-blur p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="text-xs text-muted">加我微信 · 交流</div>
            <button
              type="button"
              onClick={() => toggle(true)}
              aria-label="收起微信卡片"
              className="text-muted hover:text-fg -mt-1 -mr-1"
            >
              <CloseIcon size={14} />
            </button>
          </div>
          <div className="flex justify-center">
            <div className="inline-block rounded border border-border p-1.5 bg-surface">
              <Image
                src="/images/wechat-qr.jpg"
                alt="微信二维码 - 天空一声响"
                width={160}
                height={160}
                className="block"
              />
            </div>
          </div>
          <div className="mt-3 text-center">
            <div className="text-sm font-semibold">天空一声响</div>
            <div className="mt-1 text-xs text-muted">江苏南京 · 注明博客</div>
          </div>
        </aside>
      )}
    </div>
  );
}
