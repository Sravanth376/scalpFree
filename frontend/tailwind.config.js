/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#edfaf5',
          100: '#d3f4e7',
          200: '#aae8d2',
          300: '#72d5b8',
          400: '#3ab99a',
          500: '#1a9e81',
          600: '#107f69',
          700: '#0d6555',
          800: '#0d5045',
          900: '#0b4239',
          950: '#052a25',
        },
      },
      fontFamily: {
        display: ['"DM Serif Display"', 'serif'],
        sans:    ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}
