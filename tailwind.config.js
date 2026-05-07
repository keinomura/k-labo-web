/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./howto.html", "./js/**/*.js"],
  theme: {
    extend: {
      colors: {
        navy: {
          900: "#0F172A",
          800: "#1E293B",
          700: "#1E3A5F",
        },
        brand: {
          blue: "#2563EB",
          green: "#10B981",
        },
      },
      fontFamily: {
        sans: [
          "Hiragino Kaku Gothic ProN",
          "Hiragino Sans",
          "Noto Sans JP",
          "Yu Gothic",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
