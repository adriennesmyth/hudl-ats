/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        hudl: {
          orange: '#ff6300',
          'orange-hover': '#ff6e00',
          'orange-light': '#fff4ee',
          dark: '#232a31',
        },
      },
    },
  },
  plugins: [],
}
