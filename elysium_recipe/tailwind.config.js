/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        alchemy: {
          dark: '#1a1625',
          darker: '#0f0e15',
          purple: '#6c5ce7',
          gold: '#ffd700',
          silver: '#c0c0c0',
          copper: '#b87333',
        }
      }
    },
  },
  plugins: [],
}
