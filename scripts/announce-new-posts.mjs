#!/usr/bin/env node
// 扫描最近 1 次 commit 新增的文章并推送飞书卡片
// 用法: node scripts/announce-new-posts.mjs

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { notifyCard } from './feishu-notify.mjs';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');

function getAddedPostFiles() {
  try {
    const out = execSync('git diff --name-only --diff-filter=A HEAD~1 HEAD', { encoding: 'utf8' });
    return out
      .split('\n')
      .filter((f) => /^content\/posts\/.+\.mdx?$/.test(f.trim()))
      .map((f) => f.trim());
  } catch {
    return [];
  }
}

function readPost(file) {
  const raw = fs.readFileSync(file, 'utf8');
  const { data } = matter(raw);
  const slug = data.slug ?? path.basename(file).replace(/\.mdx?$/, '');
  return {
    title: data.title ?? slug,
    slug,
    summary: data.summary ?? '',
    tags: data.tags ?? [],
    url: `${SITE_URL}/posts/${slug}`,
  };
}

async function main() {
  const files = getAddedPostFiles();
  if (files.length === 0) {
    console.log('本次 commit 无新增文章,跳过推送');
    return;
  }
  for (const f of files) {
    const p = readPost(f);
    const fields = [
      `**${p.title}**`,
      p.summary ? `> ${p.summary}` : '',
      p.tags.length ? `标签:${p.tags.map((t) => `#${t}`).join(' ')}` : '',
      `[阅读全文](${p.url})`,
    ].filter(Boolean);
    const r = await notifyCard('📝 博客新文章', fields);
    console.log(`推送 ${p.slug}:`, r.ok ?? r.skipped ? '成功' : '失败');
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
