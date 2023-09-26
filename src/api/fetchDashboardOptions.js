import apiBase from '@/api/getApiBase';

let cachedData;

export default async function () {
  if (cachedData) {
    return await new Promise((res) => {
      setTimeout(() => {
        res(cachedData);
      }, 10);
    });
  }

  const dataForUi = await apiBase('dashboard_filters');
  cachedData = dataForUi;
  return dataForUi;
}
