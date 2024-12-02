/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/*.html", "./src/**/*.js", "**.html"],
  theme: {
    extend: {
      colors: {
        gray: {
          1000: "#f2f2f2",
        },
      },
    },
  },
  plugins: [],
};
