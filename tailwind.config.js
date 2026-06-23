/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        'primary-hover': '#1D4ED8',
      },
      width: {
        popup: '400px',
      },
      height: {
        popup: '620px',
      },
    },
  },
  plugins: [],
}
