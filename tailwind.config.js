/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: '#172033',
        mist: '#eef3f7',
        cobalt: '#2156a3',
        fern: '#387761',
        ember: '#c56b35',
      },
      boxShadow: {
        soft: '0 18px 50px rgba(23, 32, 51, 0.10)',
      },
    },
  },
  plugins: [],
};
