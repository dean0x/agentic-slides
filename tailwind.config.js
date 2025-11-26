/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'San Francisco', 'Helvetica Neue', 'sans-serif'],
      },
      colors: {
        background: '#FFFFFF', // Pure White
        surface: '#F5F5F7', // Apple Light Gray
        primary: '#0071e3', // Apple Blue
        secondary: '#86868b', // Apple Gray Text
        text: '#1d1d1f', // Apple Dark Gray (Almost Black)
        accent: '#ff3b30', // Apple Red
      },
      boxShadow: {
        'apple': '0 4px 24px rgba(0, 0, 0, 0.04)',
        'apple-hover': '0 8px 32px rgba(0, 0, 0, 0.08)',
      }
    },
  },
  plugins: [],
}
