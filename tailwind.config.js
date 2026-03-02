/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        hudl: {
          orange: '#FF6600',
          'orange-hover': '#E55A00',
          'orange-light': '#FFF3EC',
          dark: '#1A1A1A',
        },
      },
    },
  },
  plugins: [],
}
