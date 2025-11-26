/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#030213',
        secondary: '#1A202C',
        accent: '#D53F8C',
        neutral: '#F7FAFC',
        error: '#F56565',
        success: '#48BB78',
        warning: '#F6E05E',
        info: '#3182CE',
        light: '#F7FAFC',
        dark: '#1A202C',
      }
    },
  },
  plugins: [],
}
