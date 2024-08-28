/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    fontFamily: {
      main: ['Poppins', 'sans-serif']
    },
    extend: {
      width: {
        main: '1220px'
      },
      backgroundColor: {
        main: '#ee3131'
      },
      colors: {
        main: '#ee3131',
        white: "#fff",
        'pure-black': '#291f1f',
        'color-10-light': '#f04646',
        'color-10-dark': '#d62c2c',
        'color-20-light': '#f15a5a',
        'color-20-dark': '#be2727',
        'color-30-light': '#f36f6f',
        'color-30-dark': '#a72222',
        'color-40-light': '#f58383',
        'color-40-dark': '#8f1d1d',
        'color-50-light': '#f79898',
        'color-50-dark': '#771919',
        'color-60-light': '#f8adad',
        'color-60-dark': '#5f1414',
        'color-70-light': '#fac1c1',
        'color-70-dark': '#470f0f',
      },
      borderColor: {
        basic: '#ebebeb'
      }
    },
  },
  plugins: [],
}