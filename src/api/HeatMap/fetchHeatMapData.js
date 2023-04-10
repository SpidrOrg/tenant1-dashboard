import _ from 'lodash';
import { parse, getMonth, getYear, add, format } from 'date-fns';

import getApiBase from '../getApiBase';

export const ALL_CUSTOMERS = 'All Customers';
const NAME = 'Name';

function getPeriodLabel(dateString, lag) {
  const parsedDateObj = new Date(parse(dateString, 'yyyy-MM-dd', new Date()));
  const monthIndex = getMonth(parsedDateObj);
  const year = getYear(parsedDateObj);
  const periodStartDate = format(
    add(new Date(year, monthIndex), { months: lag }),
    'MMM ‘yy'
  );
  const periodEndDate = format(
    add(new Date(year, monthIndex), { months: lag + 2 }),
    'MMM ‘yy'
  );

  return `${periodStartDate} - ${periodEndDate}`;
}

export default async function ({
  marketSensingRefreshDate,
  valueORvolume,
  customers,
  categories,
  lag,
}) {
  const data = await getApiBase('heatmapdashboard', {
    marketSensingRefreshDate,
    valueORvolume,
    customers: _.join(customers, ','),
    categories: _.join(categories, ','),
    lag,
  });

  const varianceArr = _.get(data, 'variance');
  const columnHeaders = _.concat(NAME, _.get(data, 'categories'));
  const records = _.map(_.get(data, 'customers'), (customer, index) => {
    const customerName = customer === '*' ? ALL_CUSTOMERS : customer;
    const rowData = _.map(varianceArr, (el) => {
      return el[index];
    });
    return _.concat(customerName, rowData);
  });

  const dataForUi = {
    period: getPeriodLabel(marketSensingRefreshDate, lag),
    columnHeaders,
    records,
  };

  return dataForUi;
}
