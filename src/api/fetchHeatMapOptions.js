// import apiBase from "@/api/getApiBase";

export default async function () {
  // const dataForUi = await apiBase('heatmapfilters');

  return await new Promise((resolve) =>
    setTimeout(() => {
      resolve({
        marketSensingRefreshDates: [
          '2023-02-01',
          '2023-01-01',
          '2022-12-01',
          '2022-11-01',
          '2022-10-01',
          '2022-09-01',
        ],
      });
    }, 1500)
  );
}
