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
        neonBlueHover: "#1AB6FF", // Hover variant
        neonPinkHover: "#FF33FF", 
      },
      borderRadius: {
        'extra-large': '1.5rem', // For larger rounded corners
      },
      animation: {
        glow: 'glow 1s ease-in-out infinite', // Custom glowing animation
      },
      keyframes: {
        glow: {
          '0%': { textShadow: '0 0 5px #00FFFF, 0 0 10px #00FFFF' },
          '50%': { textShadow: '0 0 20px #FF00FF, 0 0 30px #FF00FF' },
          '100%': { textShadow: '0 0 5px #00FFFF, 0 0 10px #00FFFF' },
        },
      },
    },
  },
  plugins: [],
};
