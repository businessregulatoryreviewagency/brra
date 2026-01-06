/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brra-blue': {
          600: '#2563EB',
          700: '#1E3A8A',
        },
        'brra-emerald': {
          600: '#10B981',
          700: '#059669',
        }
      }
    },
  },
  plugins: [],
}
