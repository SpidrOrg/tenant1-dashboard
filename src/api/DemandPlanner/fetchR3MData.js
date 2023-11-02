import _ from 'lodash';
import apiBase from '@/api/getApiBase';
import fetchDashboardOptions from '@/api/fetchDashboardOptions';
// const apiRes = [
//   {
//     'Mar 21 - May 21': {
//       metrics: {
//         marketSensingGrowth: 0.81,
//         jdaGrowth: 23.72,
//         pyGrowth: 19.33,
//         impliedGrowth: 264.02,
//         keyDemandDrivers: [
//           {
//             'Production Activity': 74.27,
//           },
//           {
//             'Consumption Activity': 13.96,
//           },
//           {
//             'Overall Economic Health': 4.4,
//           },
//           {
//             'Commercial Spending': 3.77,
//           },
//           {
//             'Consumer Demand': 3.61,
//           },
//         ],
//         historical: [
//           {
//             period: 'Sep 20 - Nov 20',
//             'Market Sensing': null,
//             Internal: null,
//             Actual: null,
//             Adjusted: null,
//           },
//           {
//             period: 'Oct 20 - Dec 20',
//             'Market Sensing': null,
//             Internal: null,
//             Actual: null,
//             Adjusted: null,
//           },
//           {
//             period: 'Nov 20 - Jan 21',
//             'Market Sensing': -6.57,
//             Internal: 415.42,
//             Actual: 367.58,
//             Adjusted: null,
//           },
//           {
//             period: 'Dec 20 - Feb 21',
//             'Market Sensing': -5.97,
//             Internal: 127.13,
//             Actual: 101.34,
//             Adjusted: null,
//           },
//           {
//             period: 'Jan 21 - Mar 21',
//             'Market Sensing': -8.44,
//             Internal: 25.61,
//             Actual: 7.41,
//             Adjusted: null,
//           },
//           {
//             period: 'Feb 21 - Apr 21',
//             'Market Sensing': -4.56,
//             Internal: 23.82,
//             Actual: 17.23,
//             Adjusted: null,
//           },
//         ],
//       },
//       horizon: '1_3m',
//     },
//   },
//   {
//     'Jun 21 - Aug 21': {
//       metrics: {
//         marketSensingGrowth: 0.88,
//         jdaGrowth: -13.87,
//         pyGrowth: 24.91,
//         impliedGrowth: -170.55,
//         keyDemandDrivers: [
//           {
//             'Consumption Activity': 44.67,
//           },
//           {
//             'Production Activity': 18.97,
//           },
//           {
//             'Financial Activity': 18.27,
//           },
//           {
//             POS: 9.74,
//           },
//           {
//             'Overall Economic Health': 5.82,
//           },
//           {
//             'Climate Disruptions': 2.54,
//           },
//         ],
//         historical: [
//           {
//             period: 'Sep 20 - Nov 20',
//             'Market Sensing': null,
//             Internal: 101.08,
//             Actual: 101.34,
//             Adjusted: null,
//           },
//           {
//             period: 'Oct 20 - Dec 20',
//             'Market Sensing': null,
//             Internal: 22.95,
//             Actual: 7.41,
//             Adjusted: null,
//           },
//           {
//             period: 'Nov 20 - Jan 21',
//             'Market Sensing': -6.83,
//             Internal: 17.07,
//             Actual: 17.23,
//             Adjusted: null,
//           },
//           {
//             period: 'Dec 20 - Feb 21',
//             'Market Sensing': -2.8,
//             Internal: 13.12,
//             Actual: 19.93,
//             Adjusted: null,
//           },
//           {
//             period: 'Jan 21 - Mar 21',
//             'Market Sensing': -7.89,
//             Internal: 45.86,
//             Actual: 34.3,
//             Adjusted: null,
//           },
//           {
//             period: 'Feb 21 - Apr 21',
//             'Market Sensing': -4.52,
//             Internal: 2.95,
//             Actual: 1.11,
//             Adjusted: null,
//           },
//         ],
//       },
//       horizon: '4_6m',
//     },
//   },
//   {
//     'Sep 21 - Nov 21': {
//       metrics: {
//         marketSensingGrowth: null,
//         jdaGrowth: -10.76,
//         pyGrowth: 19.14,
//         impliedGrowth: null,
//         keyDemandDrivers: [
//           {
//             '': 0,
//           },
//         ],
//         historical: [
//           {
//             period: 'Sep 20 - Nov 20',
//             'Market Sensing': null,
//             Internal: 23.72,
//             Actual: 19.93,
//             Adjusted: null,
//           },
//           {
//             period: 'Oct 20 - Dec 20',
//             'Market Sensing': null,
//             Internal: 44.1,
//             Actual: 34.3,
//             Adjusted: null,
//           },
//           {
//             period: 'Nov 20 - Jan 21',
//             'Market Sensing': null,
//             Internal: 21.1,
//             Actual: 1.11,
//             Adjusted: null,
//           },
//           {
//             period: 'Dec 20 - Feb 21',
//             'Market Sensing': null,
//             Internal: -12.9,
//             Actual: -5.83,
//             Adjusted: null,
//           },
//           {
//             period: 'Jan 21 - Mar 21',
//             'Market Sensing': null,
//             Internal: -9.39,
//             Actual: -15.43,
//             Adjusted: null,
//           },
//           {
//             period: 'Feb 21 - Apr 21',
//             'Market Sensing': null,
//             Internal: -18.23,
//             Actual: -13.83,
//             Adjusted: null,
//           },
//         ],
//       },
//       horizon: '7_9m',
//     },
//   },
//   {
//     'Dec 21 - Feb 22': {
//       metrics: {
//         marketSensingGrowth: null,
//         jdaGrowth: 11.15,
//         pyGrowth: 22.69,
//         impliedGrowth: null,
//         keyDemandDrivers: [
//           {
//             '': 0,
//           },
//         ],
//         historical: [
//           {
//             period: 'Sep 20 - Nov 20',
//             'Market Sensing': null,
//             Internal: -13.87,
//             Actual: -5.83,
//             Adjusted: null,
//           },
//           {
//             period: 'Oct 20 - Dec 20',
//             'Market Sensing': null,
//             Internal: -11.18,
//             Actual: -15.43,
//             Adjusted: null,
//           },
//           {
//             period: 'Nov 20 - Jan 21',
//             'Market Sensing': null,
//             Internal: 1.28,
//             Actual: -13.83,
//             Adjusted: null,
//           },
//           {
//             period: 'Dec 20 - Feb 21',
//             'Market Sensing': null,
//             Internal: 9.34,
//             Actual: -12.3,
//             Adjusted: null,
//           },
//           {
//             period: 'Jan 21 - Mar 21',
//             'Market Sensing': null,
//             Internal: 1.32,
//             Actual: -5.04,
//             Adjusted: null,
//           },
//           {
//             period: 'Feb 21 - Apr 21',
//             'Market Sensing': null,
//             Internal: -2.76,
//             Actual: -8.6,
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
  valueORvolume,
  splits,
  isMonthlyMode = false
}) {
  const filterOptions = await fetchDashboardOptions();
  const data = await apiBase('maindashboard', {
    marketSensingRefreshDate,
    categories,
    valueORvolume,
    splits,
    msModels: _.join(_.get(filterOptions, 'ms.msTimeHorizon'), '___'),
    isMonthlyMode
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
