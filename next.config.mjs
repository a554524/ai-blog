/**
 * BUILD_MODE 开关:
 *   - "static" (默认):输出纯静态 HTML 到 out/,部 Cloudflare Pages / 任何静态主机
 *   - "dynamic":走 Next.js Node 运行时,部 Vercel / 自建服务器
 *
 * 切换:  export BUILD_MODE=dynamic && npm run build
 *
 * 当前所有页面都是 SSG,两种模式对外表现一致。未来要加登录/收藏/ISR/API 时切 dynamic。
 */
const STATIC = process.env.BUILD_MODE !== 'dynamic';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  ...(STATIC && { output: 'export' }),
  trailingSlash: STATIC,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [],
    ...(STATIC && { unoptimized: true }),
  },
};

export default nextConfig;
