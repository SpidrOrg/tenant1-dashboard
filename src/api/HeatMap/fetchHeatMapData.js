import _ from 'lodash';
import getApiBase from '../getApiBase';

// let cachedData = [
//   {
//     period: 'Mar 23 - May 23',
//     columnHeaders: [
//       'Name',
//       'Category1',
//       'Category2',
//       'Category3',
//       'Category4',
//       'Category5',
//       'Category6',
//       'Category7',
//     ],
//     records: [
//       ['Customer0', 14, 14, 23, 32, 67, 98, 3],
//       ['Customer1', 4, 54, 3, 52, 6, 98, 34],
//       ['Customer2', 44, 24, 83, 62, 7, 38, 23],
//       ['Customer3', 54, 84, 53, 72, 67, 8, 63],
//     ],
//   },
//   {
//     period: 'Jun 23 - Aug 23',
//     columnHeaders: [
//       'Name',
//       'Category1',
//       'Category2',
//       'Category3',
//       'Category4',
//       'Category5',
//       'Category6',
//       'Category7',
//     ],
//     records: [
//       ['Value(USD)', 14, 14, 23, 32, 67, 98, 3],
//       ['Customer1', 4, 54, 3, 52, 6, 98, 34],
//       ['Customer2', 44, 24, 83, 62, 7, 38, 23],
//       ['Customer3', 54, 84, 53, 72, 67, 8, 63],
//     ],
//   },
//   {
//     period: 'Sep 23 - Nov 23',
//     columnHeaders: [
//       'Name',
//       'Category1',
//       'Category2',
//       'Category3',
//       'Category4',
//       'Category5',
//       'Category6',
//       'Category7',
//     ],
//     records: [
//       ['Value(USD)', 14, 14, 23, 32, 67, 98, 3],
//       ['Customer1', 4, 54, 3, 52, 6, 98, 34],
//       ['Customer2', 44, 24, 83, 62, 7, 38, 23],
//       ['Customer3', 54, 84, 53, 72, 67, 8, 63],
//     ],
//   },
//   {
//     period: 'Dec 23 - Feb 24',
//     columnHeaders: [
//       'Name',
//       'Category1',
//       'Category2',
//       'Category3',
//       'Category4',
//       'Category5',
//       'Category6',
//       'Category7',
//     ],
//     records: [
//       ['Value(USD)', 14, 14, 23, 32, 67, 98, 3],
//       ['Customer1', 4, 54, 3, 52, 6, 98, 34],
//       ['Customer2', 44, 24, 83, 62, 7, 38, 23],
//       ['Customer3', 54, 84, 53, 72, 67, 8, 63],
//     ],
//   },
// ];
let cachedData;
export default async function ({
  marketSensingRefreshDate,
  valueORvolume,
  customers,
  categories,
}) {
  if (cachedData) {
    return await new Promise((res) => {
      setTimeout(() => {
        res(cachedData);
      }, 1300);
    });
  }
  const data = await getApiBase('heatmapdashboard', {
    marketSensingRefreshDate,
    valueORvolume,
    customers: _.join(customers, ','),
    categories: _.join(categories, ','),
  });

  let dataForUi = _.get(data, 'result', {});
  dataForUi = _.map(dataForUi, (v) => {
    const records = _.map(_.get(v, 'records'), (record) => {
      return _.map(record, (r, i) => {
        if (i === 0) return r;
        return _.isNaN(_.toNumber(r)) ? 0 : _.round(_.toNumber(r), 0);
      });
    });
    return {
      ...v,
      records,
    };
  });
  return dataForUi;
}
