import apiBase from '@/api/getApiBase';

let cachedData;
// cachedData = {
//   performance: [
//     ['Aug-22-Oct-22', '92.0'],
//     ['Sep-22-Nov-22', '90.0'],
//     ['Oct-22-Dec-22', '92.0'],
//     ['Nov-22-Jan-23', '89.0'],
//     ['Dec-22-Feb-23', '90.0'],
//     ['Jan-23-Mar-23', '87.0'],
//     ['Feb-23-Apr-23', '86.0'],
//   ],
// };

export default async function ({
  marketSensingRefreshDate,
  category,
  horizon,
  forecastPeriodType,
}) {
  if (cachedData) {
    return await new Promise((res) => {
      setTimeout(() => {
        res(cachedData);
      }, 5000);
    });
  }

  const data = await apiBase('historical_model_accuracy', {
    marketSensingRefreshDate,
    category,
    horizon,
    forecastPeriodType,
  });

  return data;
}
