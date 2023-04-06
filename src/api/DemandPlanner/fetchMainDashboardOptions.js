import apiBase from '@/api/getApiBase';

let cachedData;
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

  const dataForUi = await apiBase('maindashboardfilters');
  return dataForUi;
}
