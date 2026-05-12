/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
      colors: {
        cream: '#f0ebe0',
        'cream-dark': '#e8e0d0',
        ink: '#1e1a14',
        'ink-muted': '#5a5040',
        'ink-faint': '#9a8e7a',
        terracotta: '#c4603a',
        'slate-blue': '#4a6275',
        'dusty-rose': '#a86e6e',
        'deep-black': '#0a0a0f',
      },
    },
  },
  plugins: [],
}
