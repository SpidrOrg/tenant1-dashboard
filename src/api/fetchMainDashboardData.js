import { invokeApi } from '@/parent/idpUtils';
import _ from 'lodash';

let cachedData = JSON.parse(
  '[{"period":"Jan 23 - Mar 23","lag":"1-3","marketSensing":19,"internal":13,"impliedMarketShare":{"pyActual":11,"implied":14},"modelAccuracy":{"current":99.33},"externalKPIs":{"Stock market":48,"Inflation":30,"Per-capita disposable income":9,"Pandemic":9,"Consumer behaviour":3,"Loans consumption":1},"historical":{"identifiers":["period","Market Sensing","Internal","Actual"],"data":[["May22 - Jul22",17,25,21],["Jun22 - Aug22",23,12,19],["Jul22 - Sep22",9,36,12],["Aug22 - Oct22",13,31,14],["Sep22 - Nov22",18,36,34],["Oct22 - Dec22",10,32,21]]},"variance":6},{"period":"Apr 23 - June 23","lag":"4-6","marketSensing":6,"internal":27,"impliedMarketShare":{"pyActual":8,"implied":13},"modelAccuracy":{"current":92.33},"externalKPIs":{"Stock market":55,"Inflation":25,"Per-capita disposable income":9,"Pandemic":5,"Consumer behaviour":3,"Loans consumption":3},"historical":{"identifiers":["period","Market Sensing","Internal","Actual"],"data":[["May22 - Jul22",17,25,21],["Jun22 - Aug22",23,12,19],["Jul22 - Sep22",9,36,12],["Aug22 - Oct22",13,31,14],["Sep22 - Nov22",18,36,34],["Oct22 - Dec22",10,32,21]]},"variance":-21},{"period":"Jul 23 - Sept 23","lag":"7-9","marketSensing":16,"internal":14,"impliedMarketShare":{"pyActual":11,"implied":17},"modelAccuracy":{"current":95.33},"externalKPIs":{"Stock market":60,"Inflation":10,"Per-capita disposable income":10,"Pandemic":9,"Consumer behaviour":7,"Loans consumption":2},"historical":{"identifiers":["period","Market Sensing","Internal","Actual"],"data":[["May22 - Jul22",17,25,21],["Jun22 - Aug22",23,12,19],["Jul22 - Sep22",9,36,12],["Aug22 - Oct22",13,31,14],["Sep22 - Nov22",18,36,34],["Oct22 - Dec22",10,32,21]]},"variance":2},{"period":"Oct 23 - Dec 23","lag":"10-12","marketSensing":-3,"internal":11,"impliedMarketShare":{"pyActual":2,"implied":-3},"modelAccuracy":{"current":91.33},"externalKPIs":{"Stock market":44,"Inflation":24,"Per-capita disposable income":19,"Pandemic":5,"Consumer behaviour":3,"Loans consumption":2},"historical":{"identifiers":["period","Market Sensing","Internal","Actual"],"data":[["May22 - Jul22",17,25,21],["Jun22 - Aug22",23,12,19],["Jul22 - Sep22",9,36,12],["Aug22 - Oct22",13,31,14],["Sep22 - Nov22",18,36,34],["Oct22 - Dec22",10,32,21]]},"variance":-14}]'
);
export default async function () {
  if (cachedData) {
    return await new Promise((res) => {
      setTimeout(() => {
        res(cachedData);
      }, 1300);
    });
  }
  const data = await invokeApi('maindashboard'); // apidatacleint2 //maindashboard
  let dataForUi = _.get(data, 'projectionsData.projections', []);
  dataForUi = _.map(dataForUi, (v) => ({
    ...v,
    variance: v.marketSensing - v.internal,
  }));
  cachedData = dataForUi;
  return dataForUi;
}
