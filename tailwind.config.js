/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/renderer/*.{html, tsx}',
    'node_modules/daisyui/dist/**/*.js',
    'node_modules/react-daisyui/dist/**/*.js',
  ],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
  // daisyui: {
  //   styled: true,
  //   themes: true,
  //   base: true,
  //   utils: true,
  //   logs: true,
  //   rtl: false,
  //   prefix: '',
  //   darkTheme: 'light',
  // },
  daisyui:{
    themes: ['emerald']
  }
};
