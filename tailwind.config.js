/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // This line enables dark mode based on a class in the HTML
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
