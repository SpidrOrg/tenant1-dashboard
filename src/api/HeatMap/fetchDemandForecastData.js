import _ from 'lodash';
import { VALUE, VOLUME } from './fetchHeatMapData';

import getApiBase from '../getApiBase';

const getNumericValue = (value) => {
  if (value === null || _.isNaN(_.toNumber(value))) {
    return 0;
  }
  return _.toNumber(value);
};

const getCustomerValueForApi = (customer) => {
  if (customer === VALUE || customer === VOLUME) {
    return '*';
  }
  return customer;
};

// let cachedData = [
//   ['Jun 22 - Aug 22', 12, 33, 44],
//   ['Aug 22 - Oct 22', 55, 70, 40],
//   ['Sep 22 - Nov 22', 13, 66, 20],
//   ['Oct 22 - Dec 22', 24, 30, 54],
//   ['Nov 22 - Jan 23', 55, 70, 40],
//   ['Dec 22 - Feb 23', 13, 66, 20],
//   ['Jan 23 - Mar 23', 24, 10, 40],
//   ['Feb 23 - Apr 23', 55, 11, 4],
//   ['Mar 23 - May 23', 13, 60, 90],
//   ['Apr 23 - Jun 23', 24, 30, 50],
//   ['May 23 - Jul 23', 13, 10, 4],
// ];

export default async function ({
  marketSensingRefreshDate,
  valueORvolume,
  category,
  customer,
  lag,
}) {
  // if (cachedData) {
  //   return await new Promise((res) => {
  //     setTimeout(() => {
  //       res(cachedData);
  //     }, 1300);
  //   });
  // }

  const data = await getApiBase('heat_map_historical', {
    marketSensingRefreshDate,
    valueORvolume,
    category,
    customer: getCustomerValueForApi(customer),
    lag,
  });

  const dataKeys = _.keys(data);
  let dataForUi = _.map(dataKeys, (key) => {
    const values = _.get(data, `${key}`);
    const msForecastGrowth = getNumericValue(_.get(values, 'msForecastGrwoth'));
    const internalForecastGrowth = getNumericValue(
      _.get(values, 'internalForecastGrowth')
    );
    const actualGrowth = getNumericValue(_.get(values, 'actualGrowth'));

    return {
      period: key,
      msForecastGrowth,
      internalForecastGrowth,
      actualGrowth,
    };
  });

  return dataForUi;
}
