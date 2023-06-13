import apiBase from '@/api/getApiBase';

let cachedData;
// cachedData = {
//   ms: {
//     categories: ['pta', 'power drill'],
//     customers: [
//       'Harbor Freight Tools',
//       'Home Depot',
//       "Lowe's",
//       'Others',
//       'Amazon.com',
//     ],
//     msTimeHorizon: ['1_3m', '4_6m'],
//     msTimeHorizonFormatted: ['1-3 Months', '4-6 Months'],
//     msModel: ['pta_1_3m', 'power_drill_4_6m', 'pta_4_6m', 'power_drill_1_3m'],
//   },
//   updateDates: [
//     '2021-02-01',
//     '2021-01-01',
//     '2020-12-01',
//     '2020-11-01',
//     '2020-10-01',
//     '2020-09-01',
//     '2020-08-01',
//     '2020-07-01',
//     '2020-06-01',
//     '2020-05-01',
//     '2020-04-01',
//     '2020-03-01',
//     '2020-02-01',
//     '2020-01-01',
//     '2019-12-01',
//     '2019-11-01',
//     '2019-10-01',
//     '2019-09-01',
//     '2019-08-01',
//     '2019-07-01',
//     '2019-06-01',
//     '2019-05-01',
//     '2019-04-01',
//     '2019-03-01',
//     '2019-02-01',
//     '2019-01-01',
//     '2018-12-01',
//     '2018-11-01',
//     '2018-10-01',
//     '2018-09-01',
//     '2018-08-01',
//     '2018-07-01',
//     '2018-06-01',
//   ],
//   clientData: {
//     models: ['1-3 Months', '4-6 Months'],
//   },
// };

export default async function () {
  if (cachedData) {
    return await new Promise((res) => {
      setTimeout(() => {
        res(cachedData);
      }, 100);
    });
  }

  const dataForUi = await apiBase('dashboard_filters');
  return dataForUi;
}
