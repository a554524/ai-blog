import type { Metadata } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: {
    default: 'AI 技术博客',
    template: '%s · AI 技术博客',
  },
  description: '分享 AI 实战教程与免费 AI 工具推荐。',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
