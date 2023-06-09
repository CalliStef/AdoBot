/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        gloria: ['"Gloria Hallelujah"'],
        manrope: ['"Manrope"'],
      }
    },
   
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
}

