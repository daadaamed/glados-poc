module.exports = {
  content: ["./public/index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    fontFamily: { "sans": ["Poppins"] },
    extend: { colors: { "secondary": "#FC9E2D" } } 
  },
  plugins: [require("@tailwindcss/forms")],
}
