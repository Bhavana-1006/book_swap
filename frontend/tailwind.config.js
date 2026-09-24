/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#faf8f5',
          100: '#f6f3ee',
          200: '#eee8de',
          300: '#e1d7c7'
        },
        navy: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          600: '#243b53',
          700: '#102a43',
          800: '#0c1e30',
          900: '#07111c'
        },
        brand: {
          50: '#effaf6',
          100: '#d7f3e8',
          200: '#b2e6d3',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46'
        },
        accent: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Calistoga', 'Georgia', 'serif']
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(12, 30, 48, 0.06)',
        'hover': '0 12px 28px -4px rgba(12, 30, 48, 0.12)',
        'modal': '0 20px 40px -8px rgba(7, 17, 28, 0.25)'
      }
    },
  },
  plugins: [],
}
