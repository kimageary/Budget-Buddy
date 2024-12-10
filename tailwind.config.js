/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.{html,ejs}"],
  theme: {
    extend: {
      transitionProperty:{
        width: 'width',
      },
      inset: {
        '9' : '9%',
        '-100' : '-100%',
      },
    },
  },
  plugins: [],
}

