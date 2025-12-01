/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dungeon: {
          dark: '#121212',
          darker: '#0d0d0d',
          panel: '#1e1e1e',
          border: '#333',
          accent: '#ff9800',
          danger: '#ef5350',
          heal: '#66bb6a',
          rare: '#42a5f5',
          epic: '#ab47bc',
          legend: '#ffca28',
          boss: '#b71c1c',
        }
      },
      animation: {
        'bounce-item': 'bounce-item 1.5s infinite ease-in-out',
        'pulse-glow': 'pulse-glow 2s infinite',
        'slide-up': 'slide-up 0.3s ease-out',
        'shake': 'shake 0.5s ease-in-out',
      },
      keyframes: {
        'bounce-item': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(255, 152, 0, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(255, 152, 0, 0.8)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
      },
    },
  },
  plugins: [],
}
