/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'], // check all file extensions being used
  theme: {
    extend: {
      screens: {
        '3xl': '1700px' // custom screen size
      }
    }
  },
  plugins: []
};
