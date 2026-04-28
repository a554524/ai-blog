#!/usr/bin/env node
// 博客运维 CLI,供飞书机器人或人工触发
// 用法:
//   node scripts/blog-cli.mjs status           站点概览
//   node scripts/blog-cli.mjs list             最近 10 篇文章
//   node scripts/blog-cli.mjs tools            工具目录计数
//   node scripts/blog-cli.mjs build            触发一次构建(阻塞)
//   node scripts/blog-cli.mjs notify <文本>    直接推送文本到飞书

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import matter from 'gray-matter';
import { notify, notifyCard } from './feishu-notify.mjs';

const ROOT = path.resolve(new URL('..', import.meta.url).pathname);
const POSTS_DIR = path.join(ROOT, 'content', 'posts');
const TOOLS_DIR = path.join(ROOT, 'content', 'tools');

function loadPosts() {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => /\.mdx?$/.test(f))
    .map((f) => {
      const raw = fs.readFileSync(path.join(POSTS_DIR, f), 'utf8');
      const { data } = matter(raw);
      const date =
        data.date instanceof Date
          ? data.date.toISOString().slice(0, 10)
          : String(data.date ?? '').slice(0, 10);
      return {
        slug: data.slug ?? f.replace(/\.mdx?$/, ''),
        title: data.title ?? f,
        date,
        draft: data.draft ?? false,
      };
    })
    .filter((p) => !p.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

function loadTools() {
  if (!fs.existsSync(TOOLS_DIR)) return [];
  return fs.readdirSync(TOOLS_DIR).filter((f) => /\.mdx?$/.test(f));
}

function cmdStatus() {
  const posts = loadPosts();
  const tools = loadTools();
  const latest = posts[0];
  return {
    title: '博客状态',
    lines: [
      `**文章数**:${posts.length}`,
      `**工具数**:${tools.length}`,
      latest ? `**最新文章**:${latest.title} (${latest.date})` : '暂无文章',
    ],
  };
}

function cmdList(n = 10) {
  const posts = loadPosts().slice(0, n);
  return {
    title: `最近 ${posts.length} 篇文章`,
    lines: posts.map((p) => `\`${p.date}\` ${p.title}`),
  };
}

function cmdTools() {
  return {
    title: '工具目录',
    lines: [`共 ${loadTools().length} 条`],
  };
}

function cmdBuild() {
  try {
    execSync('npm run build', { cwd: ROOT, stdio: 'pipe' });
    return { title: '构建成功', lines: ['本次 `npm run build` 通过'] };
  } catch (e) {
    const msg = (e.stderr?.toString() ?? e.message ?? '未知错误').slice(-500);
    return { title: '构建失败', lines: ['```', msg, '```'] };
  }
}

async function main() {
  const [cmd, ...rest] = process.argv.slice(2);
  let result;
  switch (cmd) {
    case 'status':
      result = cmdStatus();
      break;
    case 'list':
      result = cmdList(Number(rest[0] ?? 10));
      break;
    case 'tools':
      result = cmdTools();
      break;
    case 'build':
      result = cmdBuild();
      break;
    case 'notify': {
      const text = rest.join(' ') || '(空)';
      const r = await notify(text);
      console.log(JSON.stringify(r));
      return;
    }
    default:
      console.error('未知命令。可用:status | list [N] | tools | build | notify <文本>');
      process.exit(1);
  }
  // 本地打印
  console.log(`# ${result.title}`);
  for (const l of result.lines) console.log(l);
  // 尝试推送到飞书 (如配置)
  await notifyCard(result.title, result.lines);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
