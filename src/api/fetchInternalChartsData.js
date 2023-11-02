import _ from 'lodash';
import getApiBase from './getApiBase';

const mockedData = {
  "result": {
    "data": {
      "t + 1m": {
        "forecastSales": 32.34,
        "forecastGrowth": null,
        "actualSales": 45.86,
        "actualGrowth": null,
        "msProjectedGrowth": null
      },
      "t + 2m": {
        "forecastSales": 8,
        "forecastGrowth": null,
        "actualSales": 18,
        "actualGrowth": null,
        "msProjectedGrowth": null
      },
      "t + 3m": {
        "forecastSales": -25,
        "forecastGrowth": null,
        "actualSales": -3,
        "actualGrowth": null,
        "msProjectedGrowth": null
      },
      "t + 4m": {
        "forecastSales": 30,
        "forecastGrowth": null,
        "actualSales": 10,
        "actualGrowth": null,
        "msProjectedGrowth": null
      },
      "t + 5m": {
        "forecastSales": -35,
        "forecastGrowth": null,
        "actualSales": -30,
        "actualGrowth": null,
        "msProjectedGrowth": null
      },
      "t + 6m": {
        "forecastSales": null,
        "forecastGrowth": null,
        "actualSales": 8,
        "actualGrowth": null,
        "msProjectedGrowth": null
      }
    },
    "unit": "%"
  }
}
export default async function ({categories, customers,valueORvolume,msTimeHorizon,internalModel, refreshDate}) {
  const data = await getApiBase('internalcharts',{
    marketSensingRefreshDate:refreshDate,
    categories,
    customers,
    valueORvolume,
    msTimeHorizon,
    internalModel
  });
  // const data = await Promise.resolve(mockedData)
  let dataForUi = _.get(data, "result.data", {});
  let unit = _.get(data, "result.unit", {});

  dataForUi = _.map(dataForUi, (v,k) => ({
    ...v,
    timeline:k,
    actualGrowth: v.actualGrowth==null || v.actualGrowth==''  ? 0 : v.actualGrowth,
    forecastSales: v.forecastSales==null || v.forecastSales==''  ? 0 : v.forecastSales,
    forecastGrowth: v.forecastGrowth==null || v.forecastGrowth==''  ? 0 : v.forecastGrowth,
    msProjectedGrowth: v.msProjectedGrowth==null || v.msProjectedGrowth==''  ? 0 : v.msProjectedGrowth,
    actualSales: v.actualSales==null || v.actualSales==''  ? 0 : v.actualSales,
    unit: unit
  }));

  console.log(dataForUi);
   return dataForUi;
 }
