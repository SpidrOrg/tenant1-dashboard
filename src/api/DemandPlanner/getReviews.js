import _ from 'lodash';
import getApiBase from '../getApiBase';

export default async function ({
  refreshDate,
  customer,
  category,
  valueOrQuantity,
  periodStart,
  periodEnd,
  forecastPeriodType,
}) {
  const data = await getApiBase('reviews', {
    refreshDate,
    customer,
    category,
    valueOrQuantity,
    periodStart,
    periodEnd,
    forecastPeriodType,
    invalidate: `${Date.now()}`
  });

  const headers = _.get(data, 'result.headers');
  const reviews = _.get(data, 'result.data');
  const dataForUi = _.map(reviews, (item) => {
    const reviewObj = {};
    _.forEach(headers, (header, index) => {
      reviewObj[header] = item[index];
    });
    return reviewObj;
  });

  return dataForUi;
}
