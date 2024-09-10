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
      flex: {
        '2': '2 2 0%',
        '3': '3 3 0%',
        '4': '4 4 0%',
        '5': '5 5 0%',
        '6': '6 6 0%',
        '7': '7 7 0%',
        '8': '8 8 0%',
      },
      backgroundColor: {
        main: '#ee3131'
      },
      colors: {
        main: '#ee3131',
        white: "#fff",
        'pure-black': '#291f1f',
        'pure-white': "#fff",
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
      },
      keyframes: {
        'slide-top' :{
          '0%': {
            '-webkit-transform': 'translateY(40px);',
                    transform: 'translateY(20px);'
          },
          '100%': {
            '-webkit-transform': 'translateY(0);',
                    transform: 'translateY(0);'
          }
        }
      },
      animation: {
        'slide-top' : 'slide-top 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;'
      }
    }
  },
  plugins: [],
}