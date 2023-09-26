import _ from 'lodash';
import {
  format as formatFn,
  startOfQuarter,
  startOfMonth,
  add,
  parse,
} from 'date-fns';
import apiBase from '@/api/getApiBase';

export default async function ({
                                 marketSensingRefreshDate,
                                 categories,
                                 valueORvolume,
                                 splits
}) {
  const data = await apiBase('maindashboard', {
    marketSensingRefreshDate: formatFn(
      startOfMonth(
        add(
          startOfQuarter(
            parse(marketSensingRefreshDate, 'yyyy-MM-dd', new Date())
          ),
          {
            days: -1,
          }
        )
      ),
      'yyyy-MM-dd'
    ),
    categories,
    valueORvolume,
    splits,
    isFixed: true
  });

  // const data = await new Promise((res)=>{
  //   setTimeout(()=>{
  //     res({result: apiRes})
  //   }, 100)
  // })
  let dataForUi = _.get(data, 'result', {});
  _.forEach(dataForUi, (v) => {
    const periodData = _.get(_.values(v), '[0]');
    periodData.modelAccuracy = _.toNumber(periodData.modelAccuracy);
    const metricsObj = _.get(periodData, 'metrics');
    _.forOwn(metricsObj, (v, k) => {
      if (!(k === 'historical' || k === 'keyDemandDrivers')) {
        metricsObj[k] = v === null ? 'NA' : _.round(_.toNumber(v), 0);
      }
    });
  });
  return dataForUi;
}
