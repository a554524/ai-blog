#!/usr/bin/env node
// 飞书机器人 · WebSocket 长连接 · 接收 @ 消息触发博客指令
//
// 用法:
//   export FEISHU_APP_ID=cli_xxx
//   export FEISHU_APP_SECRET=xxx
//   node scripts/feishu-bot.mjs
//
// 支持指令(在飞书群 @机器人 发送):
//   status         - 返回博客概览
//   list [N]       - 最近 N 篇文章,默认 10
//   tools          - 工具目录计数
//   build          - 触发一次构建
//   help           - 可用指令

import * as Lark from '@larksuiteoapi/node-sdk';
import { execSync } from 'node:child_process';
import path from 'node:path';

const APP_ID = process.env.FEISHU_APP_ID;
const APP_SECRET = process.env.FEISHU_APP_SECRET;

if (!APP_ID || !APP_SECRET) {
  console.error('需要 FEISHU_APP_ID 与 FEISHU_APP_SECRET');
  process.exit(1);
}

const ROOT = path.resolve(new URL('..', import.meta.url).pathname);

const client = new Lark.Client({ appId: APP_ID, appSecret: APP_SECRET });

async function sendReply(chatId, text) {
  try {
    await client.im.message.create({
      params: { receive_id_type: 'chat_id' },
      data: {
        receive_id: chatId,
        msg_type: 'text',
        content: JSON.stringify({ text }),
      },
    });
  } catch (e) {
    console.error('回复失败', e?.message ?? e);
  }
}

function runCli(args) {
  try {
    const out = execSync(`node scripts/blog-cli.mjs ${args}`, { cwd: ROOT, encoding: 'utf8' });
    return out.trim().slice(-1500) || '(无输出)';
  } catch (e) {
    return `执行失败:\n${(e.stderr?.toString() ?? e.message).slice(-1000)}`;
  }
}

function stripMentions(raw) {
  try {
    const obj = typeof raw === 'string' ? JSON.parse(raw) : raw;
    return (obj?.text ?? '').replace(/@_user_\d+/g, '').trim();
  } catch {
    return String(raw ?? '').trim();
  }
}

function dispatch(text) {
  const [cmd, ...rest] = text.split(/\s+/).filter(Boolean);
  switch ((cmd ?? '').toLowerCase()) {
    case 'status':
      return runCli('status');
    case 'list':
      return runCli(`list ${Number(rest[0] ?? 10)}`);
    case 'tools':
      return runCli('tools');
    case 'build':
      return runCli('build');
    case 'help':
    case '':
      return [
        '可用指令:',
        '  status        博客概览',
        '  list [N]      最近 N 篇文章',
        '  tools         工具数',
        '  build         触发构建',
        '  help          本帮助',
      ].join('\n');
    default:
      return `未知指令: ${cmd}\n发送 help 查看可用指令`;
  }
}

const eventDispatcher = new Lark.EventDispatcher({}).register({
  'im.message.receive_v1': async (data) => {
    const msg = data.message;
    const chatId = msg.chat_id;
    const text = stripMentions(msg.content);
    console.log(`[msg] chat=${chatId?.slice(0, 12)} text=${text}`);

    const reply = dispatch(text);
    await sendReply(chatId, reply);
    return { code: 0 };
  },
});

const wsClient = new Lark.WSClient({
  appId: APP_ID,
  appSecret: APP_SECRET,
  loggerLevel: Lark.LoggerLevel.info,
});

console.log('feishu-bot 启动中…');
wsClient.start({ eventDispatcher });
