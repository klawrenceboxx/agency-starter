import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        'surface-hover': 'var(--color-surface-hover)',
        primary: 'var(--color-primary)',
        accent: 'var(--color-accent)',
        border: 'var(--color-border)',
        'text-base': 'var(--color-text)',
        muted: 'var(--color-text-muted)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'JetBrains Mono', 'monospace'],
      },
      transitionTimingFunction: {
        snappy: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

export default config
