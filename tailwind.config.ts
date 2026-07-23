import type { Config } from 'tailwindcss';

/**
 * Tailwind konfiqurasiyası.
 * Tema `class` strategiyası ilə idarə olunur: `<html class="dark">` → tünd tema.
 * Rənglər CSS dəyişənlərinə bağlanır (index.css) ki, tema keçidi anında işləsin.
 */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Səthlər — CSS dəyişənlərindən oxunur (həm açıq, həm tünd)
        surface: 'rgb(var(--surface) / <alpha-value>)',
        'surface-2': 'rgb(var(--surface-2) / <alpha-value>)',
        border: 'rgb(var(--border) / <alpha-value>)',
        content: 'rgb(var(--content) / <alpha-value>)',
        'content-muted': 'rgb(var(--content-muted) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)',
        'accent-hover': 'rgb(var(--accent-hover) / <alpha-value>)',
      },
      boxShadow: {
        panel: '0 4px 24px -8px rgb(0 0 0 / 0.25)',
      },
    },
  },
  plugins: [],
} satisfies Config;
