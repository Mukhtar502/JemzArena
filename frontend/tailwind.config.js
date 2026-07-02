export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        glow: "0 25px 80px rgba(15, 23, 42, 0.12)",
      },
      colors: {
        brand: {
          light: "#f8efe4",
          mid: "#c98936",
          dark: "#2f2118",
        },
      },
    },
  },
  plugins: [],
};
