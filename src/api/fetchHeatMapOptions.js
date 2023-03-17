import apiBase from "@/api/getApiBase";

export default async function (){
  const dataForUi = await apiBase('maindashboardfilters');
  // const d = {
  //   "marketSensingRefreshDates": [
  //     "2023-02-01",
  //     "2023-01-01",
  //     "2022-12-01",
  //     "2022-11-01",
  //     "2022-10-01",
  //     "2022-09-01"
  //   ],
  //   "categories": [
  //     "a",
  //     "b",
  //     "c",
  //     "d",
  //     "e"
  //   ],
  //   "customers": [
  //     "Source_1",
  //     "Source_2",
  //     "Source_3",
  //     "Source_4"
  //   ]
  // }
  // const dataForUi = await new Promise((res)=>{
  //   setTimeout(()=>{
  //     res(d);
  //   }, 100)
  // })
  return dataForUi;
}
