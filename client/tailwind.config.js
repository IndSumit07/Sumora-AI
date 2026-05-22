/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Chakra Petch"', "sans-serif"],
        serif: ['"Instrument Serif"', "serif"],
      },
    },
  },
  plugins: [],
};
