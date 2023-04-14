import apiBase from '@/api/getApiBase';

let cachedData;
// cachedData = {
//   ms: {
//     categories: ['pta', 'hand tools', 'storage', 'htas'],
//     customers: [
//       'Others',
//       'Amazon.com',
//       'Harbor Freight Tools',
//       'Home Depot',
//       "Lowe's",
//       'Others12m',
//     ],
//     msTimeHorizon: ['4_6m', '1m', '1_3m', '6m', '10_12m', '3m', '12m', '7_9m'],
//     msTimeHorizonFormatted: [
//       '4-6 Months',
//       '1 Months',
//       '1-3 Months',
//       '6 Months',
//       '10-12 Months',
//       '3 Months',
//       '12 Months',
//       '7-9 Months',
//     ],
//     msModel: [
//       'pta_1m',
//       'htas_12m',
//       'pta_12m',
//       'htas_1_3m',
//       'pta_1_3m',
//       'storage_1m',
//       'pta_3m',
//       'hand tools_4_6m',
//       'hand tools_1m',
//       'storage_4_6m',
//       'pta_7_9m',
//       'hand tools_1_3m',
//       'pta_6m',
//       'hand tools_6m',
//       'storage_1_3m',
//       'storage_10_12m',
//       'htas_4_6m',
//       'htas_1m',
//       'storage_3m',
//       'pta_4_6m',
//       'htas_10_12m',
//       'pta_10_12m',
//       'storage_12m',
//       'htas_3m',
//       'htas_6m',
//       'hand tools_10_12m',
//       'hand tools_3m',
//       'hand tools_12m',
//       'storage_6m',
//       'hand tools_7_9m',
//       'htas_7_9m',
//       'storage_7_9m',
//     ],
//   },
//   updateDates: [
//     '2023-04-01',
//     '2023-03-01',
//     '2023-02-01',
//     '2023-01-01',
//     '2022-12-01',
//     '2022-11-01',
//   ],
// };

// cachedData = {
//   marketSensingRefreshDates: [
//     '2023-02-01',
//     '2023-01-01',
//     '2022-12-01',
//     '2022-11-01',
//     '2022-10-01',
//     '2022-09-01',
//   ],
//   categories: ['pta', 'htas', 'storage', 'hand tools'],
//   customers: [
//     "Lowe's",
//     'Others',
//     'Others12m',
//     'Amazon.com',
//     'Home Depot',
//     'Harbor Freight Tools',
//   ],
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
