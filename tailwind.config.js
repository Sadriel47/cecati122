import { colors } from './src/theme/colors.js';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['class', '.dark-theme'],
  theme: {
    extend: {
      colors: {
        // Referencia directa al archivo centralizado src/theme/colors.js
        cecati: {
          DEFAULT: colors.cecati.DEFAULT,
          primary: colors.cecati.primary,
          hover: colors.cecati.hover,
          light: colors.cecati.light,
          accent: colors.cecati.accent,
        },
        darkBg: colors.dark.bg,
        darkCard: colors.dark.card,
        darkHover: colors.dark.hover,
        darkBorder: colors.dark.border,
        
        // Mapeo de la escala gray a los valores centralizados
        gray: {
          950: '#0C0E14',
          900: colors.dark.bg,      // #12161F
          800: colors.dark.card,    // #1A1F2C
          700: colors.dark.border,  // #252B3B
          600: '#3E465A',
          500: colors.light.text,   // #6C778F
          400: colors.dark.text,    // #9BA5B9
          300: '#C9D0DF',
          200: colors.light.border, // #E4E8F1
          100: '#F1F4F9',
          50:  colors.light.bg,     // #F8F9FC
        }
      }
    },
  },
  plugins: [],
}
