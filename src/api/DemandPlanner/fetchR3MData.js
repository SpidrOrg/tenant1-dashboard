import _ from 'lodash';
import apiBase from '@/api/getApiBase';
// const apiRes = [
//   {
//     'May 23 - Jul 23': {
//       metrics: {
//         marketSensingGrowth: null,
//         jdaGrowth: 27.35,
//         pyGrowth: 18.29,
//         impliedGrowth: null,
//         keyDemandDrivers: [
//           {
//             '3m_snfwt$.iusa': 16.48,
//           },
//           {
//             y_lag_1: 15.66,
//           },
//           {
//             '3m_ifrsmf$.iusa': 14.11,
//           },
//           {
//             y_lag_1: 13.01,
//           },
//           {
//             'wpip06790302.m_lag3': 12.75,
//           },
//           {
//             'bcfdellrcq.iusa_lag2': 12.04,
//           },
//         ],
//         historical: [
//           {
//             period: 'Aug 22 - Oct 22',
//             'Market Sensing': null,
//             Internal: 13.3,
//             Actual: -0.49,
//             Adjusted: null,
//           },
//           {
//             period: 'Sep 22 - Nov 22',
//             'Market Sensing': null,
//             Internal: 171.31,
//             Actual: 2.02,
//             Adjusted: null,
//           },
//           {
//             period: 'Oct 22 - Dec 22',
//             'Market Sensing': null,
//             Internal: 21.92,
//             Actual: 9.7,
//             Adjusted: null,
//           },
//           {
//             period: 'Nov 22 - Jan 23',
//             'Market Sensing': null,
//             Internal: 30.21,
//             Actual: 10.07,
//             Adjusted: 0,
//           },
//           {
//             period: 'Dec 22 - Feb 23',
//             'Market Sensing': null,
//             Internal: 17.46,
//             Actual: 11.32,
//             Adjusted: null,
//           },
//           {
//             period: 'Jan 23 - Mar 23',
//             'Market Sensing': null,
//             Internal: 19.78,
//             Actual: 11.54,
//             Adjusted: null,
//           },
//         ],
//       },
//       horizon: '1_3m',
//     },
//   },
//   {
//     'Aug 23 - Oct 23': {
//       metrics: {
//         marketSensingGrowth: null,
//         jdaGrowth: 4.51,
//         pyGrowth: 13.9,
//         impliedGrowth: null,
//         keyDemandDrivers: [
//           {
//             y_lag_1: 38.7,
//           },
//           {
//             'sfr$.iusa': 34.58,
//           },
//           {
//             y_lag_1: 15.98,
//           },
//           {
//             'pciutpr6ch.m_lag2': 15.36,
//           },
//           {
//             'ppi331110p.m_lag1': 13.68,
//           },
//           {
//             y_lag_1: 13.29,
//           },
//         ],
//         historical: [
//           {
//             period: 'Aug 22 - Oct 22',
//             'Market Sensing': null,
//             Internal: 14.57,
//             Actual: 10.07,
//             Adjusted: null,
//           },
//           {
//             period: 'Sep 22 - Nov 22',
//             'Market Sensing': null,
//             Internal: 11.01,
//             Actual: 11.32,
//             Adjusted: null,
//           },
//           {
//             period: 'Oct 22 - Dec 22',
//             'Market Sensing': null,
//             Internal: 40.86,
//             Actual: 11.54,
//             Adjusted: null,
//           },
//           {
//             period: 'Nov 22 - Jan 23',
//             'Market Sensing': null,
//             Internal: 37.1,
//             Actual: -28.7,
//             Adjusted: 0,
//           },
//           {
//             period: 'Dec 22 - Feb 23',
//             'Market Sensing': null,
//             Internal: 21.63,
//             Actual: -63.24,
//             Adjusted: null,
//           },
//           {
//             period: 'Jan 23 - Mar 23',
//             'Market Sensing': null,
//             Internal: 1.96,
//             Actual: null,
//             Adjusted: null,
//           },
//         ],
//       },
//       horizon: '4_6m',
//     },
//   },
//   {
//     'Nov 23 - Jan 24': {
//       metrics: {
//         marketSensingGrowth: null,
//         jdaGrowth: null,
//         pyGrowth: 15.68,
//         impliedGrowth: null,
//         keyDemandDrivers: [
//           {
//             y_lag_1: 60.33,
//           },
//           {
//             y_lag_1: 20.14,
//           },
//           {
//             y_lag_1: 13.23,
//           },
//           {
//             '3m_ims.iusa': 12.99,
//           },
//           {
//             y_lag_1: 9.92,
//           },
//           {
//             'ims$.iusa_lag2': 8.73,
//           },
//         ],
//         historical: [
//           {
//             period: 'Aug 22 - Oct 22',
//             'Market Sensing': null,
//             Internal: 27.35,
//             Actual: -28.7,
//             Adjusted: null,
//           },
//           {
//             period: 'Sep 22 - Nov 22',
//             'Market Sensing': null,
//             Internal: 21.66,
//             Actual: -63.24,
//             Adjusted: null,
//           },
//           {
//             period: 'Oct 22 - Dec 22',
//             'Market Sensing': null,
//             Internal: 4.85,
//             Actual: null,
//             Adjusted: null,
//           },
//           {
//             period: 'Nov 22 - Jan 23',
//             'Market Sensing': null,
//             Internal: 3.47,
//             Actual: null,
//             Adjusted: 0,
//           },
//           {
//             period: 'Dec 22 - Feb 23',
//             'Market Sensing': null,
//             Internal: -4.22,
//             Actual: null,
//             Adjusted: null,
//           },
//           {
//             period: 'Jan 23 - Mar 23',
//             'Market Sensing': null,
//             Internal: null,
//             Actual: null,
//             Adjusted: null,
//           },
//         ],
//       },
//       horizon: '7_9m',
//     },
//   },
//   {
//     'Feb 24 - Apr 24': {
//       metrics: {
//         marketSensingGrowth: null,
//         jdaGrowth: null,
//         pyGrowth: 16.13,
//         impliedGrowth: null,
//         keyDemandDrivers: [
//           {
//             '3m_snfwt$.iusa': 42.43,
//           },
//           {
//             y_lag_1: 37.28,
//           },
//           {
//             'snfwt$.iusa': 24.1,
//           },
//           {
//             'snfwt$.iusa_lag1': 18.18,
//           },
//           {
//             y_lag_1: 16.68,
//           },
//           {
//             'xeciwpgdmfdarq.iusa': 16.26,
//           },
//         ],
//         historical: [
//           {
//             period: 'Aug 22 - Oct 22',
//             'Market Sensing': null,
//             Internal: 4.51,
//             Actual: null,
//             Adjusted: null,
//           },
//           {
//             period: 'Sep 22 - Nov 22',
//             'Market Sensing': null,
//             Internal: 0.1,
//             Actual: null,
//             Adjusted: null,
//           },
//           {
//             period: 'Oct 22 - Dec 22',
//             'Market Sensing': null,
//             Internal: null,
//             Actual: null,
//             Adjusted: null,
//           },
//           {
//             period: 'Nov 22 - Jan 23',
//             'Market Sensing': null,
//             Internal: null,
//             Actual: null,
//             Adjusted: 0,
//           },
//           {
//             period: 'Dec 22 - Feb 23',
//             'Market Sensing': null,
//             Internal: null,
//             Actual: null,
//             Adjusted: null,
//           },
//           {
//             period: 'Jan 23 - Mar 23',
//             'Market Sensing': null,
//             Internal: null,
//             Actual: null,
//             Adjusted: null,
//           },
//         ],
//       },
//       horizon: '10_12m',
//     },
//   },
// ];

export default async function ({
  marketSensingRefreshDate,
  categories,
  customers,
  valueORvolume,
}) {
  const data = await apiBase('maindashboard', {
    marketSensingRefreshDate,
    categories,
    customers,
    valueORvolume,
  });

  // const data = await new Promise((res) => {
  //   setTimeout(() => {
  //     res({ result: apiRes });
  //   }, 100);
  // });
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
