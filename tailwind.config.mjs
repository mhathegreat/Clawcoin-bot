/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        helvetica: ["Helvetica"],
      },
      colors: {
        neonBlue: "#00FFFF",
        neonPink: "#FF00FF",
        darkBg: "#121212", // Dark background
        chatBubbleUser: "#00BFFF", // User chat bubble color (light blue)
        chatBubbleBot: "#FF1493", // MARU chat bubble color (deep pink)
        borderGlow: "#0ff", // Glowing border color
      },
    },
  },
  plugins: [],
};
