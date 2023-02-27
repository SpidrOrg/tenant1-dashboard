import _ from "lodash";
import apiBase from "@/api/getApiBase";

export default async function (){
  const dataForUi = await apiBase('maindashboardfilters');
  return dataForUi;
}
