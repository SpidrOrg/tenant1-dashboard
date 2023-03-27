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
        'brand-primary-disabled': '#C8A5F0',
        'brand-secondary-10': '#E6E6E6',
        'brand-secondary-20': '#D2D2D2',
        'brand-gray-1': '#F5F5F5',
        'brand-gray-2': '#DBDBDB',
        'brand-gray-3': '#A5A5A5',
        'brand-gray-4': '#EDEDED',
        'brand-red-1': '#DC3545',
        'brand-red-2': 'rgba(255, 52, 41, 0.6)',
        'brand-green-1': '#04BB46',
        'brand-green-2': 'rgba(4, 187, 70, 0.6)',
        'brand-green-3': '#F0FDF5',
        'brand-yellow-1': '#FF9900',
        'brand-yellow-2': 'rgba(255, 193, 7, 0.6)',
      },
      boxShadow: {
        blue: '0 0  3px 3px #4285f4',
      },
    },
  },
  plugins: [],
};
