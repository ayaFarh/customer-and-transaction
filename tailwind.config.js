/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
    colors:{
        gitty:"#35ADA1",
        whitegitty:"##eef3fa"
      }
    },
  },
  plugins: [],
}

