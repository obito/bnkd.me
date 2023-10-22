/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ["./src/*.{html,js}"],
  theme: {
    fontFamily: {
      'sans': ['Outfit', ...defaultTheme.fontFamily.sans],
    },
    extend: {
      colors: {
        'special-grey-space': '#DCDCDC',
        'special-black': '#1A1A1A',
        'special-black-p': '#8A8A8A',
        'special-black-light': '#242424',
        'special-white': '#E9E9E9',
        'special-grey': '#515151',
      },
      animation: {
        'infinite-scroll': 'infinite-scroll 25s linear infinite',
      },
      keyframes: {
        'infinite-scroll': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-100%)' },
        }
      }                    
    },
  },
  plugins: [],
}

