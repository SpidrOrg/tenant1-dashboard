import {invokeApi} from "@/parent/idpUtils";
import _ from "lodash";

let cachedData = null;
export default async function (){
  if (cachedData) {
    return await new Promise((res)=>{
      setTimeout(()=>{
        res(cachedData)
      }, 1300)
    })
  }
  const data = await invokeApi('maindashboard'); // apidatacleint2 //maindashboard
  let dataForUi = _.get(data, "projectionsData.projections", [])
  dataForUi = _.map(dataForUi, v => ({
    ...v,
    variance: v.marketSensing - v.internal
  }))
  cachedData = dataForUi;
  return dataForUi;
}
