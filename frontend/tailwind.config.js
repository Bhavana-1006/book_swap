/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#F8F3E7',
          100: '#F2ECE0',
          200: '#E7DFD1',
          300: '#D9CFC0',
          400: '#C7BBA8'
        },
        navy: {
          50: '#F0F5F6',
          100: '#D5E4E7',
          600: '#1B5462',
          700: '#16434E',
          800: '#12343B',
          900: '#0B2227'
        },
        teal: {
          50: '#F0F7F8',
          100: '#D7EAED',
          600: '#186577',
          700: '#135362',
          800: '#0F4C5C',
          900: '#12343B'
        },
        brand: {
          50: '#F0F7F8',
          100: '#D7EAED',
          200: '#A8B5A2',
          500: '#D6A756',
          600: '#0F4C5C',
          700: '#12343B',
          800: '#0F4C5C',
          900: '#0B2227'
        },
        sage: {
          50: '#F4F7F3',
          100: '#E3E9E1',
          200: '#C9D4C6',
          500: '#A8B5A2',
          600: '#8F9F88',
          700: '#5A7261'
        },
        gold: {
          50: '#FAF6EE',
          100: '#F3E8D0',
          200: '#E8D7B0',
          500: '#D6A756',
          600: '#C49340',
          700: '#A4762A'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Calistoga', 'Georgia', 'serif']
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(18, 52, 59, 0.06)',
        'hover': '0 12px 28px -4px rgba(18, 52, 59, 0.12)',
        'modal': '0 20px 40px -8px rgba(11, 34, 39, 0.25)'
      }
    },
  },
  plugins: [],
}
