// import { invokeGetApi } from '@/parent/idpUtils';
import _ from 'lodash';

let cachedData = JSON.parse('[{"internal_forecast":{"identifiers":["period","Internal","Actual"],"data":[["Dec21 - Feb22",3.2,2.4],["Jan22 - Mar22",2.5,1.6],["Feb22 - Apr22",1.8,1.1],["Mar22 - May22",1.5,1.2],["Apr22 - Jun22",2.3,1.4],["May22 - Jul22",1.6,1.8],["Jun22 - Aug22",0.8,0.3],["Jul22 - Sept22",1.3,1.2],["Aug22 - Oct22",0.6,0.8],["Sept22 - Nov22",0.7,0.9],["Oct22 - Dec22",1.3,0.8],["Nov22 - Jan23",1.6,1.8]]},"projections":{"identifiers":["period","Market Sensing","Internal","Actual"],"data":[["Dec21 - Feb22",29,26,23],["Jan22 - Mar22",40,36,30],["Feb22 - Apr22",30,28,22],["Mar22 - May22",40,35,30],["Apr22 - Jun22",36,19,26],["May22 - Jul22",41,24,32],["Jun22 - Aug22",25,23,18],["Jul22 - Sept22",33,22,13],["Aug22 - Oct22",44,36,26],["Sept22 - Nov22",33,18,22],["Oct22 - Dec22",38,28,12],["Nov22 - Jan23",32,26,23]]}}]');

export default async function (
{
    categories,
    customers,
    valueORvolume
  }) {
  if (cachedData) {
    return await new Promise((res) => {
      setTimeout(() => {
        res(cachedData);
      }, 1300);
    });
  }
//   const data = await invokeGetApi('internalcharts'); // apidatacleint2 //maindashboard
//   let dataForUi = _.get(data, 'projectionsData.projections', []);
//   dataForUi = _.map(dataForUi, (v) => ({
//     ...v,
//     variance: v.marketSensing - v.internal,
//   }));
//   cachedData = dataForUi;
//   return dataForUi;
 }
