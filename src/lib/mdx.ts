import { compileMDX } from 'next-mdx-remote/rsc';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import remarkGfm from 'remark-gfm';
import { createHighlighter, type Highlighter } from 'shiki';
import type { ReactElement } from 'react';

let highlighterPromise: Promise<Highlighter> | null = null;
function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ['github-light', 'github-dark'],
      langs: ['ts', 'tsx', 'js', 'jsx', 'json', 'bash', 'md', 'mdx', 'css', 'html', 'python'],
    });
  }
  return highlighterPromise;
}

async function rehypeShiki() {
  const h = await getHighlighter();
  return function transformer(tree: unknown) {
    visitCodeNodes(tree, (node) => {
      const lang = (node.properties?.className?.[0] as string | undefined)?.replace('language-', '');
      const raw = extractCodeText(node);
      if (!raw) return;
      try {
        const html = h.codeToHtml(raw, {
          lang: lang && h.getLoadedLanguages().includes(lang) ? lang : 'text',
          themes: { light: 'github-light', dark: 'github-dark' },
          defaultColor: false,
        });
        node.type = 'raw';
        node.value = html;
      } catch {
        // fallback: leave node untouched
      }
    });
  };
}

type AnyNode = {
  type?: string;
  tagName?: string;
  value?: string;
  properties?: { className?: string[] };
  children?: AnyNode[];
};

function visitCodeNodes(tree: unknown, visit: (node: AnyNode) => void) {
  const root = tree as AnyNode;
  const walk = (node: AnyNode | undefined) => {
    if (!node) return;
    if (node.tagName === 'pre' && node.children?.[0]?.tagName === 'code') {
      visit(node.children[0]);
    }
    node.children?.forEach(walk);
  };
  walk(root);
}

function extractCodeText(node: AnyNode): string {
  if (!node.children) return '';
  return node.children
    .map((c) => (c.type === 'text' ? (c.value ?? '') : extractCodeText(c)))
    .join('');
}

export async function renderMDX(source: string): Promise<ReactElement> {
  const shiki = await rehypeShiki();
  const { content } = await compileMDX({
    source,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: 'wrap' }],
          shiki,
        ],
      },
    },
  });
  return content;
}
