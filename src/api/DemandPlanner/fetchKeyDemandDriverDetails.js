import _ from 'lodash';
import apiBase from '@/api/getApiBase';

const dataKeys = ['dataPoint', 'source', 'value'];

let cachedData;
// cachedData = [
//   { dataPoint: 'Data point 1', source: 'IHS', value: '23.0%' },
//   { dataPoint: 'Data point 2', source: 'IHS', value: '3.4%' },
//   { dataPoint: 'Data point 3', source: 'IHS', value: '2.0%' },
//   { dataPoint: 'Data point 4', source: 'IHS', value: '5.5%' },
//   { dataPoint: 'Data point 5', source: 'IHS', value: '4.05%' },
//   { dataPoint: 'Data point 6', source: 'Moody’s', value: '53.0%' },
//   { dataPoint: 'Data point 7', source: 'Moody’s', value: '2.0%' },
//   { dataPoint: 'Data point 8', source: 'Covid19 Disruptions', value: '5.5%' },
//   {
//     dataPoint: 'Data point 9',
//     source: 'Covid19 Disruptions',
//     value: '4.05%',
//   },
//   {
//     dataPoint: 'Data point 10',
//     source: 'Covid19 Disruptions',
//     value: '5.0%',
//   },
// ];

export default async function ({
  marketSensingRefreshDate,
  category,
  horizon,
  driver,
}) {
  if (cachedData) {
    return await new Promise((res) => {
      setTimeout(() => {
        res(cachedData);
      }, 1000);
    });
  }

  const response = await apiBase('key_demand_driver_drill_down', {
    marketSensingRefreshDate,
    category,
    horizon,
    driver,
  });

  const data = _.get(response, 'data');
  let dataForUi = _.map(data, (el) => {
    const transformedElement = {};
    _.forEach(dataKeys, (key, index) => {
      transformedElement[key] = el[index];
    });
    return transformedElement;
  });

  return dataForUi;
}
