import _ from 'lodash';
import getApiBase from './getApiBase';

export default async function ({categories, customers,valueORvolume,msTimeHorizon,internalModel, refreshDate}) {
  const data = await getApiBase('internalcharts',{
    marketSensingRefreshDate:refreshDate,
    categories, 
    customers,
    valueORvolume,
    msTimeHorizon,
    internalModel
  });
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
