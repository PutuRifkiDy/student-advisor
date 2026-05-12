/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Rubik', 'sans-serif'] },
      keyframes: {
        'slide-in': { from: { opacity: 0, transform: 'translateY(8px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
      },
      animation: { 'slide-in': 'slide-in 0.2s ease-out' },
    },
  },
  plugins: [],
};
