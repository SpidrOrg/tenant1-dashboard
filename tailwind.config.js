/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./index.html", "./src/**/*.{vue, js, ts}"],
  prefix: 'tw-',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Graphik', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        "brand-gray-1": "#F5F5F5",
        "brand-gray-2": "#DBDBDB",
        "brand-gray-3": "#80868b",
        "brand-blue-1": "#1967d2",
        "brand-blue-2": "#4285f4",
        "brand-green-1": "#137333",
        "brand-green-2": "#04BB46B2",
        "brand-yellow-1": "#FFC107",
        "brand-red-1": "#FF3429"
      },
      boxShadow: {
        blue: "0 0  3px 3px #4285f4",
      },
    },
  },
  plugins: [],
};
