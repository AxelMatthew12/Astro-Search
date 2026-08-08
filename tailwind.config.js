/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // TAMBAHKAN BARIS INI
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0a0a0a',     
          card: '#161616',   
          border: '#262626', 
        },
        accent: {
          DEFAULT: '#e3c285', 
          hover: '#d4b06b'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}