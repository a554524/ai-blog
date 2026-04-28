# 飞书机器人对接

两种集成方式,按需选其一或并用。

## 方式一:自定义群机器人(推送)

无需企业认证,5 分钟接入。适合**单向通知**:新文章发布、构建结果等。

### 1. 在飞书群添加自定义机器人

1. 群设置 → 群机器人 → 添加 → 自定义机器人
2. 复制 Webhook URL
3. (可选) 开启"签名校验",复制 Secret

### 2. 配置环境变量

```bash
export FEISHU_WEBHOOK="https://open.feishu.cn/open-apis/bot/v2/hook/xxx"
export FEISHU_WEBHOOK_SECRET="xxx"   # 可选
```

### 3. 使用

```bash
# 简单文本
node scripts/feishu-notify.mjs "Hello"

# 新文章公告(扫描最近 1 次 commit 新增的 content/posts/*.mdx)
node scripts/announce-new-posts.mjs

# CLI 输出 + 自动推送
node scripts/blog-cli.mjs status
node scripts/blog-cli.mjs list 5
node scripts/blog-cli.mjs build
```

### 4. 接入发布流程

在 CI(GitHub Actions)`main` 分支成功部署后,追加一步:

```yaml
- name: Notify Feishu
  env:
    FEISHU_WEBHOOK: ${{ secrets.FEISHU_WEBHOOK }}
    FEISHU_WEBHOOK_SECRET: ${{ secrets.FEISHU_WEBHOOK_SECRET }}
    NEXT_PUBLIC_SITE_URL: ${{ vars.SITE_URL }}
  run: node scripts/announce-new-posts.mjs
```

---

## 方式二:自建机器人应用(双向)

需要飞书开发者后台创建自建应用,能接收消息并执行指令。适合**双向交互**。

### 1. 创建应用

1. 访问 https://open.feishu.cn,开发者后台 → 创建企业自建应用
2. 基础信息 → 获取 `App ID` 和 `App Secret`
3. 权限管理 → 开通:
   - `im:message`
   - `im:message.group_at_msg`
   - `im:message.group_at_msg:readonly`
   - `im:chat`
4. 事件订阅 → 订阅事件 `im.message.receive_v1`
5. 事件订阅 → 推送方式选择 **长连接(WebSocket)**,无需公网 IP

### 2. 配置环境变量

```bash
export FEISHU_APP_ID="cli_xxx"
export FEISHU_APP_SECRET="xxx"
```

### 3. 启动机器人

```bash
node scripts/feishu-bot.mjs
```

机器人在飞书群被 @ 时,解析文本触发指令:

| 指令 | 作用 |
|------|------|
| `status` | 博客概览(文章数/工具数/最新文章) |
| `list [N]` | 最近 N 篇文章,默认 10 |
| `tools` | 工具目录计数 |
| `build` | 本地触发一次 `npm run build` |
| `help` | 显示帮助 |

### 4. 以服务运行

用 `systemd` 或 `pm2` 保持进程:

```bash
# systemd 示例
cat >/tmp/ai-blog-feishu.service <<EOF
[Unit]
Description=ai-blog feishu bot
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$HOME/ai-blog
Environment=FEISHU_APP_ID=cli_xxx
Environment=FEISHU_APP_SECRET=xxx
ExecStart=/usr/bin/node scripts/feishu-bot.mjs
Restart=on-failure

[Install]
WantedBy=default.target
EOF
```

---

## 安全建议

- 不要把 Webhook、AppSecret 提交到仓库,用环境变量或 secret manager
- 自定义机器人建议开启签名校验
- 机器人 `build` 命令会阻塞,长时间任务请另起进程异步触发
