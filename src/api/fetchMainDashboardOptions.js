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
  //     "Category 1",
  //     "Category 2",
  //     "Category 3",
  //     "Category 4",
  //     "Category 5",
  //     "Category 6",
  //     "Category 7",
  //     "Category 8"
  //   ],
  //   "customers": [
  //     "Company1",
  //     "Company2",
  //     "Company3",
  //     "Company4",
  //     "Company5",
  //     "Company6",
  //     "Company7",
  //     "Company8",
  //     "Company9",
  //     "Company10",
  //     "Company11",
  //     "Company12",
  //     "Company13",
  //     "Company14",
  //     "Company15",
  //     "Company16",
  //     "Company17",
  //     "Company18",
  //     "Company19",
  //     "Company20",
  //     "Company21",
  //     "Company22",
  //     "Company23",
  //     "Company24",
  //     "Company25",
  //     "Company26",
  //     "Company27",
  //     "Company28",
  //     "Company29",
  //     "Company30",
  //     "Company31",
  //     "Company32",
  //     "Company33",
  //     "Company34",
  //     "Company35",
  //     "Company36",
  //     "Company37",
  //     "Company38",
  //     "Company39",
  //     "Company40",
  //     "Company41",
  //     "Company42",
  //     "Company43",
  //     "Company44",
  //     "Company45",
  //     "Company46",
  //     "Company47",
  //     "Company48",
  //     "Company49",
  //     "Company50"
  //   ]
  // }
  // const dataForUi = await new Promise((res)=>{
  //   setTimeout(()=>{
  //     res(d);
  //   }, 100)
  // })
  return dataForUi;
}
