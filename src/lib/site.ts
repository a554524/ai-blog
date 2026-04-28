export const site = {
  name: 'AI 技术博客',
  tagline: '分享 AI 实战教程与免费 AI 工具',
  description: '专注 AI 实战教程、Prompt 工程、Agent 开发与免费 AI 工具推荐。',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  author: {
    name: 'mi',
    email: '',
    github: '',
  },
  nav: [
    { href: '/posts', label: '文章' },
    { href: '/tools', label: 'AI 工具' },
    { href: '/archive', label: '归档' },
    { href: '/about', label: '关于' },
  ],
  postsPerPage: 10,
} as const;

export type Site = typeof site;
