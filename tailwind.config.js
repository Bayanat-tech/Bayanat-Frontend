/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./public/index.html', './src/**/*.{html,js, jsx,ts,tsx}'],
  theme: {
    extend: {
      screens: {
        '3xl': '1700px'
      }
    }
  },
  plugins: []
};
