import { describe, it, expect } from 'vitest';
import { execSync } from 'node:child_process';
import path from 'node:path';

const ROOT = path.resolve(__dirname, '..');

function runCli(args: string): string {
  return execSync(`node scripts/blog-cli.mjs ${args}`, {
    cwd: ROOT,
    encoding: 'utf8',
    env: { ...process.env, FEISHU_WEBHOOK: '' },
  });
}

describe('blog-cli', () => {
  it('status returns post and tool counts', () => {
    const out = runCli('status');
    expect(out).toContain('博客状态');
    expect(out).toMatch(/文章数.*\d+/);
    expect(out).toMatch(/工具数.*\d+/);
  });

  it('list returns recent posts', () => {
    const out = runCli('list 2');
    expect(out).toContain('最近');
    expect(out.split('\n').length).toBeGreaterThan(1);
  });

  it('tools returns tool count', () => {
    const out = runCli('tools');
    expect(out).toContain('工具目录');
  });

  it('unknown command exits non-zero', () => {
    expect(() => execSync('node scripts/blog-cli.mjs __bad__', { cwd: ROOT })).toThrow();
  });
});
