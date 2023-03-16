import getApiBase from './getApiBase';

let cachedData = [
  {
    period: 'Mar 23 - May 23',
    columnHeaders: [
      'Name',
      'Category1',
      'Category2',
      'Category3',
      'Category4',
      'Category5',
      'Category6',
      'Category7',
    ],
    records: [
      ['Value(USD)', 14, 14, 23, 32, 67, 98, 3],
      ['Customer1', 4, 54, 3, 52, 6, 98, 34],
      ['Customer2', 44, 24, 83, 62, 7, 38, 23],
      ['Customer3', 54, 84, 53, 72, 67, 8, 63],
    ],
  },
  {
    period: 'Jun 23 - Aug 23',
    columnHeaders: [
      'Name',
      'Category1',
      'Category2',
      'Category3',
      'Category4',
      'Category5',
      'Category6',
      'Category7',
    ],
    records: [
      ['Value(USD)', 14, 14, 23, 32, 67, 98, 3],
      ['Customer1', 4, 54, 3, 52, 6, 98, 34],
      ['Customer2', 44, 24, 83, 62, 7, 38, 23],
      ['Customer3', 54, 84, 53, 72, 67, 8, 63],
    ],
  },
  {
    period: 'Sep 23 - Nov 23',
    columnHeaders: [
      'Name',
      'Category1',
      'Category2',
      'Category3',
      'Category4',
      'Category5',
      'Category6',
      'Category7',
    ],
    records: [
      ['Value(USD)', 14, 14, 23, 32, 67, 98, 3],
      ['Customer1', 4, 54, 3, 52, 6, 98, 34],
      ['Customer2', 44, 24, 83, 62, 7, 38, 23],
      ['Customer3', 54, 84, 53, 72, 67, 8, 63],
    ],
  },
  {
    period: 'Dec 23 - Feb 24',
    columnHeaders: [
      'Name',
      'Category1',
      'Category2',
      'Category3',
      'Category4',
      'Category5',
      'Category6',
      'Category7',
    ],
    records: [
      ['Value(USD)', 14, 14, 23, 32, 67, 98, 3],
      ['Customer1', 4, 54, 3, 52, 6, 98, 34],
      ['Customer2', 44, 24, 83, 62, 7, 38, 23],
      ['Customer3', 54, 84, 53, 72, 67, 8, 63],
    ],
  },
];
export default async function ({ marketSensingRefreshDate, valueORvolume }) {
  if (cachedData) {
    return await new Promise((res) => {
      setTimeout(() => {
        res(cachedData);
      }, 1300);
    });
  }
  const data = await getApiBase('heatmap', {
    marketSensingRefreshDate,
    valueORvolume,
  });
  return data;
}
