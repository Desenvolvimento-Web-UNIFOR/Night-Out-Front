/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0B1220",
        bgAlt: "#0F1B2E", 
        panel: "#0C1630",
        primary: "#2D6BFF",
        primary2: "#00B3FF",
        accent: "#8B5CF6",
        success: "#22C55E",
        warning: "#F59E0B",
        danger: "#EF4444",
        muted: "#AEC1D9",
        text: "#E6EEF8",
        border: "#1F2A44"
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [require('@tailwindcss/forms')],
}