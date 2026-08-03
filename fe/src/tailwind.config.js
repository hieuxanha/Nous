/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}", // Quan trọng: Phải quét đuôi .ts vì bạn viết template trong file ts
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Hoặc font bạn thích
      }
    },
  },
  plugins: [],
}