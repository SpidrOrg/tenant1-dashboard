import apiBase from "@/api/getApiBase";

export default async function () {
  const dataForUi = await apiBase('dashboard_filters');
  
  console.log(dataForUi);
  return dataForUi;
}
