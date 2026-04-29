# 部署到 Vercel(全流程)

从本地 Git 仓库到公网可访问,全程免费,大概 10 分钟。

## 步骤 1:推到 GitHub

```bash
# 登录 gh (浏览器会自动打开)
gh auth login
# 选:GitHub.com → HTTPS → Login with a web browser
# 按提示复制 one-time code,到浏览器粘贴

# 在 ~/ai-blog 下创建远端仓库并推送
cd ~/ai-blog
gh repo create ai-blog --public --source=. --remote=origin --push
```

完成后会输出仓库 URL,如 `https://github.com/<你的用户名>/ai-blog`。

## 步骤 2:连 Vercel

打开 https://vercel.com/new → Sign in with GitHub(如首次)。

1. **Import Git Repository** → 选 `ai-blog`
2. **Framework Preset**:Vercel 自动识别为 Next.js,无需改
3. **Build Command**:保持默认 `npm run build`
4. **Output Directory**:保持默认 `.next`
5. **Environment Variables**(可选,缺失时优雅降级,不影响上线):
   - `NEXT_PUBLIC_SITE_URL` = `https://<项目名>.vercel.app`(先用 Vercel 分配的,后面换自定义域名再改)
   - `NEXT_PUBLIC_GISCUS_REPO` / `_REPO_ID` / `_CATEGORY` / `_CATEGORY_ID`(评论)
   - `NEXT_PUBLIC_CF_ANALYTICS_TOKEN`(统计)
6. **Deploy**

等 2-3 分钟,Vercel 会给一个永久域名如 `https://ai-blog-xxx.vercel.app`。

## 步骤 3:写文章 → 推送 → 自动部署

```bash
# 新文章放 content/posts/*.mdx,改工具放 content/tools/*.md
git add -A
git commit -m "post: 新文章标题"
git push
```

GitHub Actions 先跑 CI(build + test),Vercel 收到 push 自动构建并发布。整条流水线不需要你手工干预。

## 步骤 4(可选):绑定自定义域名

1. 在 Vercel 项目 → Settings → Domains 添加你的域名
2. 按页面提示,在你的域名注册商处加一条 CNAME 记录指向 `cname.vercel-dns.com`
3. 等 DNS 生效(几分钟到几小时),Vercel 自动签 HTTPS 证书

之后把 `NEXT_PUBLIC_SITE_URL` 环境变量换成自定义域名,重新触发一次部署即可。

## 常见问题

**Q: 只有文章变了也要全站重建吗?**
A: 是。但 Next.js 15 增量静态生成快,30 篇文章级别的博客全站重建 < 1 分钟。

**Q: Vercel 免费额度够用吗?**
A: 个人博客完全够。免费版每月 100GB 带宽,单次构建 45 分钟内,对静态站绰绰有余。

**Q: 想同时部署到 Cloudflare Pages?**
A: 可以并用作为备份。Cloudflare Pages 也免费,国内访问更稳。仓库不变,两个平台都连同一个 GitHub 仓库即可。
