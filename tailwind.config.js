/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",     // ✅ เพิ่มอันนี้
    "./index.{js,jsx,ts,tsx}",   // ✅ เพิ่มอันนี้ด้วยถ้ามี
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#FE8C00",
        white: {
          DEFAULT: "#ffffff",
          100: "#fafafa",
          200: "#FE8C00",
        },
        gray: {
          100: "#878787",
          200: "#878787",
        },
        dark: {
          100: "#181C2E",
        },
        error: "#F14141",
        success: "#2F9B65",
      },
      fontFamily: {
        quicksand: ["Quicksend-Regular", "sans-serif"],
        "quicksand-bold": ["Quicksend-Bold", "sans-serif"],
        "quicksand-semibold": ["Quicksend-semiBold", "sans-serif"],
        "quicksand-light": ["Quicksend-Light", "sans-serif"],
        "quicksand-medium": ["Quicksend-Medium", "sans-serif"],
      },
    },
  },
  plugins: [],
};
