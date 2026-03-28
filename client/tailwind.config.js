/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  // LessonAnimatedPlayer builds gradient classes from THEME_BG at runtime — ensure JIT keeps them in production
  safelist: [
    'bg-gradient-to-br',
    'from-indigo-600',
    'via-violet-600',
    'to-fuchsia-600',
    'from-emerald-600',
    'via-teal-600',
    'to-cyan-700',
    'from-amber-500',
    'via-orange-500',
    'to-red-600',
    'from-rose-500',
    'via-pink-600',
    'to-fuchsia-700',
    'from-slate-700',
    'via-slate-800',
    'to-slate-900',
    'from-violet-600',
    'via-purple-600',
    'to-indigo-800'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef7ee',
          100: '#fdedd6',
          200: '#fad7ad',
          300: '#f6ba7a',
          400: '#f19244',
          500: '#ed721a',
          600: '#de5710',
          700: '#b8410f',
          800: '#923514',
          900: '#762e13',
        },
        secondary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

