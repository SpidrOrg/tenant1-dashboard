/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./index.html', './src/**/*.{vue, js, ts}'],
  safelist: [
    {
      pattern:
        /tw-grid-cols-(1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20|21|22|23|24|25|26|27|28|29|30|31|32|33|34|35|36|37|38|39|40|41|42|43|44|45|46|47|48|49|50|51|52|53|54|55|56|57|58|59|60|61|62|63|64|65|66|67|68|69|70)/,
    },
    {
      pattern:
        /tw-grid-rows-(1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16|17|18|19|20|21|22|23|24|25|26|27|28|29|30|31|32|33|34|35|36|37|38|39|40|41|42|43|44|45|46|47|48|49|50|51|52|53|54|55|56|57|58|59|60|61|62|63|64|65|66|67|68|70)/,
    },
  ],
  prefix: 'tw-',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Graphik', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        'brand-primary': '#7823DC',
        'brand-gray-1': '#F5F5F5',
        'brand-gray-2': '#DBDBDB',
        'brand-gray-3': '#80868b',
        'brand-gray-4': '#EDEDED',
        'brand-red-1': '#DC3545',
        'brand-red-2': '#FF3429B2',
        'brand-green-1': '#04BB46',
        'brand-green-2': '#04BB46B2',
        'brand-yellow-1': '#FF9900',
        'brand-yellow-2': '#FFC107B2',
      },
      boxShadow: {
        blue: '0 0  3px 3px #4285f4',
      },
    },
  },
  plugins: [],
};
