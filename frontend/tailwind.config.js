/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#E94560",
        secondary: "#1A1A2E",
        accent: "#0F3460",
        light: "#F5F5F5",
      }
    },
  },
  plugins: [],
};