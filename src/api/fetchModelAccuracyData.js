// import { invokeApi } from '@/parent/idpUtils';
import _ from 'lodash';

let cachedData = JSON.parse('[{"historic_performance":{"identifiers":["Period","Predicted Values","Actual Values"],"data":[["Q1-2021",3.2,2.9],["Q2-2021",2.8,2.4],["Q3-2021",3.0,2.8],["Q4-2021",2.7,2.3],["Q1-2022",2.4,2.6],["Q2-2022",2.7,2.9],["Q3-2022",2.6,2.1],["Q4-2022",2.9,2.7],["Q1-2022",2.5,0],["Q2-2022",2.4,0],["Q3-2022",2.8,0],["Q4-2022",2.9,0]]},"historic_performance_accuracy":{"identifiers":["Time Period","Prediction Accuracy"],"data":[["Q1-2021",29],["Q2-2021",40],["Q3-2021",30],["Q4-2021",40],["Q1-2022",36],["Q2-2022",41],["Q3-2022",25],["Q4-2022",33],["Q1-2022",0],["Q2-2022",0],["Q3-2022",0],["Q4-2022",0]]},"cv_accuracy":{"identifiers":["Period","Predicted Values"],"data":[["1-3 months",92],["4-6 months", 88],["6-9 months", 75],["10-12 months", 89],["1-6 months", 93],["1-12 months", 61]]},"rolling_test_accuracy":{"identifiers":["Period","Predicted Values"],"data":[["1-3 months",96],["4-6 months", 85],["6-9 months", 90],["10-12 months", 88],["1-6 months", 93],["1-12 months", 89]]}}]');

export default async function ({
  categoriesAccuracy,
  categoriesHistoric,
  projected_period
}) {
  if (cachedData) {
    return await new Promise((res) => {
      setTimeout(() => {
        res(cachedData);
      }, 1300);
    });
  }
  // const data = await invokeApi('modelaccuracy'); // apidatacleint2 //maindashboard
  // let dataForUi = _.get(data, 'projectionsData.projections', []);
  // dataForUi = _.map(dataForUi, (v) => ({
  //   ...v,
  //   variance: v.marketSensing - v.internal,
  // }));
  // cachedData = dataForUi;
  // return dataForUi;
}
