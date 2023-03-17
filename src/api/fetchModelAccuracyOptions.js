//import apiBase from "@/api/getApiBase";

export default async function () {
  //const dataForUi = await apiBase('maindashboardfilters');
  const d = {
    "categories": [
      "Category 1",
      "Category 2",
      "Category 3",
      "Category 4",
      "Category 5",
      "Category 6",
      "Category 7",
      "Category 8"
    ],
    "projected_period":[
      "1-3 months",
      "4-6 months",
      "7-9 months",
      "10-12 months"
    ]
  }
  const dataForUi = await new Promise((res)=>{
    setTimeout(()=>{
      res(d);
    }, 100)
  })
  return dataForUi;
}
