#!/usr/bin/env node
// 飞书自定义群机器人 webhook 推送
// 用法:
//   FEISHU_WEBHOOK=https://open.feishu.cn/open-apis/bot/v2/hook/xxx \
//   node scripts/feishu-notify.mjs "消息内容"
//
// 或作为模块被其他脚本引用:
//   import { notify } from './feishu-notify.mjs'

import crypto from 'node:crypto';
import process from 'node:process';

const WEBHOOK = process.env.FEISHU_WEBHOOK?.trim();
const SECRET = process.env.FEISHU_WEBHOOK_SECRET?.trim();

function sign(timestamp, secret) {
  const stringToSign = `${timestamp}\n${secret}`;
  const hmac = crypto.createHmac('sha256', stringToSign);
  hmac.update('');
  return hmac.digest('base64');
}

export async function notify(text) {
  if (!WEBHOOK) {
    console.error('FEISHU_WEBHOOK 未配置,跳过推送');
    return { skipped: true };
  }
  const payload = {
    msg_type: 'text',
    content: { text },
  };
  if (SECRET) {
    const timestamp = Math.floor(Date.now() / 1000);
    payload.timestamp = String(timestamp);
    payload.sign = sign(timestamp, SECRET);
  }
  const res = await fetch(WEBHOOK, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.code !== 0) {
    console.error('飞书推送失败:', res.status, data);
    return { ok: false, data };
  }
  return { ok: true };
}

export async function notifyCard(title, fields) {
  if (!WEBHOOK) return { skipped: true };
  const elements = fields.map((line) => ({
    tag: 'div',
    text: { content: line, tag: 'lark_md' },
  }));
  const payload = {
    msg_type: 'interactive',
    card: {
      config: { wide_screen_mode: true },
      header: {
        template: 'blue',
        title: { content: title, tag: 'plain_text' },
      },
      elements,
    },
  };
  if (SECRET) {
    const timestamp = Math.floor(Date.now() / 1000);
    payload.timestamp = String(timestamp);
    payload.sign = sign(timestamp, SECRET);
  }
  const res = await fetch(WEBHOOK, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok && data.code === 0, data };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const text = process.argv.slice(2).join(' ') || '(空消息)';
  const r = await notify(text);
  console.log(JSON.stringify(r));
  if (r.ok === false) process.exit(1);
}
