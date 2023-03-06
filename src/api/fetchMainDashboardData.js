import _ from "lodash";
import apiBase from "@/api/getApiBase";

export default async function (
  {
    marketSensingRefreshDate,
    categories,
    customers,
    valueORvolume
  }) {
  const data = await apiBase('maindashboard', {
    marketSensingRefreshDate,
    categories,
    customers,
    valueORvolume
  });
  let dataForUi = _.get(data, "projectionsData.projections", [])
  dataForUi = _.map(dataForUi, v => ({
    ...v,
    variance: v.marketSensing - v.internal
  }))
  return dataForUi;
}
