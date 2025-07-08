/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // not 'media'
  content: [
    "./layouts/**/*.html",
    "./content/**/*.md",
    "./themes/**/layouts/**/*.html",
    "./themes/**/assets/js/**/*.js",
    "./themes/**/assets/css/**/*.css",
    "./assets/**/*.html",
    "./assets/**/*.js",
    "./assets/**/*.css"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
