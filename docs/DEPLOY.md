# 部署

## 当前状态

| 平台 | 域名 | 状态 |
|------|------|------|
| Cloudflare Pages | https://ai-blog-61z.pages.dev | ✅ 生产 |
| Vercel | ai-blog-swart-five.vercel.app | 已配置但被 SSO 保护拦截,备用 |
| GitHub | https://github.com/a554524/ai-blog | ✅ 源码 |

## 构建模式切换

由 `next.config.mjs` 中的 `BUILD_MODE` 环境变量控制:

```bash
# 静态模式 (默认),输出 out/,部 Cloudflare Pages / 任何 CDN
npm run build

# 动态模式,走 Next.js Node 运行时,部 Vercel / 自建
BUILD_MODE=dynamic npm run build
```

未来要加用户登录/收藏/ISR/API 路由时切 dynamic。

## Cloudflare Pages 部署

```bash
# 构建静态产物
npm run build

# 部署 (需要 CLOUDFLARE_API_TOKEN + CLOUDFLARE_ACCOUNT_ID 环境变量)
export CLOUDFLARE_API_TOKEN=...
export CLOUDFLARE_ACCOUNT_ID=d83188253c7c02411dadd510d6e50de8
npx wrangler pages deploy out --project-name ai-blog --branch main
```

## GitHub Actions 自动部署 (建议)

`.github/workflows/ci.yml` 已配置 type-check + test + build。
补一段 Pages 部署:

```yaml
- name: Publish to Cloudflare Pages
  uses: cloudflare/wrangler-action@v3
  with:
    apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
    accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
    command: pages deploy out --project-name=ai-blog --branch=main
```

Secret 配置位置: https://github.com/a554524/ai-blog/settings/secrets/actions

## 自定义域名绑定

Cloudflare Pages 控制台 → 项目 → Custom domains → Set up a custom domain →
输入你的域名 → 按提示改 DNS CNAME 指向 `ai-blog-61z.pages.dev`。

HTTPS 证书自动签。
