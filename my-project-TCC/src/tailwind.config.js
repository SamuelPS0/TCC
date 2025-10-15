/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",          // inclui o index.html do Vite
    "./src/**/*.{js,ts,jsx,tsx}" // inclui todos os arquivos React
  ],
  theme: {
    extend: {}, // você pode adicionar cores, fontes ou espaçamentos personalizados aqui
  },
  plugins: [], // plugins do Tailwind, se precisar
}
