/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Manrope', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: { DEFAULT: '#152439', soft: '#41506a', mute: '#7a869a' },
        ivory: '#f6f3ec',
        paper: '#fffdf9',
        bronze: { DEFAULT: '#a9824f', soft: '#c7a878' },
        line: 'rgba(21,36,57,0.12)',
      },
      letterSpacing: { tightest: '-0.04em', luxe: '0.18em' },
      maxWidth: { '8xl': '88rem' },
    },
  },
  plugins: [],
};
