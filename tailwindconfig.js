/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'mariscos': {
          900: '#1a0f0a',   // Café oscuro rústico
          850: '#23150e',   // Ajuste intermedio
          800: '#2d1f14',   // Madera
          700: '#4a3328',   // Cuero
          600: '#8B4513',   // Silla de montar
          500: '#CD853F',   // Bronce
          400: '#D2691E',   // Chocolate
          300: '#DEB887',   // Burlywood
          200: '#F4A460',   // Sandy brown
          100: '#FFE4C4',   // Bisque
          50:  '#FFF8DC',   // Cornsilk
        },
        'brass': {
          DEFAULT: '#B5A642',
          light: '#D4C574',
          dark: '#8B7D2E',
        }
      },
      fontFamily: {
        'display': ['"Bebas Neue"', 'sans-serif'],
        'body': ['"Inter"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
