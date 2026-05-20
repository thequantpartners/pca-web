/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'pca-bg': '#0a0a0f',
        'pca-cyan': '#00d4ff',
        'pca-muted': '#a7a7ad',
        card: '#111827',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['Space Mono', 'ui-monospace', 'SFMono-Regular', 'Consolas', 'monospace'],
      },
      boxShadow: {
        button: '0 0 18px rgba(0, 212, 255, 0.36)',
        cyan: '0 0 22px rgba(0, 212, 255, 0.25)',
      },
    },
  },
  plugins: [],
}
