module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "cyan-750": "#2596be",
      },
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
    },
    },
    screens: {
      sm: "520px",
      md: "768px",
      ml: "860px",
      lg: "1024px",
      xl: "1160px",
      "2xl": "1350px",
      "3xl": "1700px",
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
