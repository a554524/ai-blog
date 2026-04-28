import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/app/**/*.{ts,tsx,mdx}',
    './src/components/**/*.{ts,tsx}',
    './content/**/*.{md,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: 'oklch(var(--color-bg) / <alpha-value>)',
        surface: 'oklch(var(--color-surface) / <alpha-value>)',
        border: 'oklch(var(--color-border) / <alpha-value>)',
        fg: 'oklch(var(--color-fg) / <alpha-value>)',
        muted: 'oklch(var(--color-muted) / <alpha-value>)',
        accent: 'oklch(var(--color-accent) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1.5' }],
        sm: ['0.875rem', { lineHeight: '1.6' }],
        base: ['1rem', { lineHeight: '1.7' }],
        lg: ['1.125rem', { lineHeight: '1.7' }],
        xl: ['1.5rem', { lineHeight: '1.4' }],
        '2xl': ['2rem', { lineHeight: '1.3' }],
      },
      spacing: {
        '18': '4.5rem',
      },
      maxWidth: {
        prose: '45rem',
        page: '75rem',
      },
      borderRadius: {
        sm: '0.25rem',
        DEFAULT: '0.5rem',
        lg: '0.75rem',
      },
    },
  },
  plugins: [],
};

export default config;
