import _ from 'lodash';
import { format as formatFn, getQuarter, parse, getYear } from 'date-fns';

export const MONTH_INDEX_MAP = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
};

export const formatDate = (dateString, format = 'yyyy-MM-dd') => {
  return formatFn(new Date(dateString), format);
};

export const getPeriodStartDate = (period, format = 'yyyy-MM-dd') => {
  const [month, yearShortForm] = period.split('-')[0].trim().split(' ');
  const numericYear = _.toNumber(`20${yearShortForm}`);
  const monthIndex = MONTH_INDEX_MAP[month];
  return formatFn(new Date(numericYear, monthIndex), format);
};

export const getPeriodEndDate = (period, format = 'yyyy-MM-dd') => {
  const [month, yearShortForm] = period.split('-')[1].trim().split(' ');
  const numericYear = _.toNumber(`20${yearShortForm}`);
  const monthIndex = MONTH_INDEX_MAP[month];
  return formatFn(new Date(numericYear, monthIndex), format);
};

export const getQuarterLabel = (period) => {
  const periodStartDate = getPeriodStartDate(period);
  const parsedDate = parse(periodStartDate, 'yyyy-MM-dd', new Date());
  const year = getYear(parsedDate);
  const quarterNumber = getQuarter(parsedDate);

  return `${year}-Q${quarterNumber}`;
};
