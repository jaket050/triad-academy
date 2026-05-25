/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['JetBrains Mono', 'Fira Code', 'Cascadia Code', 'monospace'],
        mono: ['JetBrains Mono', 'Fira Code', 'Cascadia Code', 'monospace'],
      },
      colors: {
        ink: '#111111',
        mist: '#1a1a1a',
        cobalt: '#00ff88',
        fern: '#00cc66',
        ember: '#ff8c42',
      },
      boxShadow: {
        soft: 'none',
      },
    },
  },
  plugins: [],
};
