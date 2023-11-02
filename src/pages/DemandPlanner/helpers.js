import { format as formatFn, parse } from 'date-fns';
import { getQuarterLabel } from '@/utils/dateHelpers';
import { FORECAST_PERIOD_TYPES } from './constants';

const { R3M_VIEW } = FORECAST_PERIOD_TYPES;

const formatPeriodLabel = (period) => {
  if (period.indexOf('-') === -1) return period;
  const periodStartDate = formatFn(
    parse(period.split('-')[0].trim(), 'MMM yy', new Date()),
    'MMM ‘yy'
  );
  const periodEndDate = formatFn(
    parse(period.split('-')[1].trim(), 'MMM yy', new Date()),
    'MMM ‘yy'
  );
  return `${periodStartDate}-${periodEndDate}`;
};

export const getPeriodDataLabel = (period, forecastPeriodType) => {
  const formattedPeriod = formatPeriodLabel(period);
  if (forecastPeriodType === R3M_VIEW) return formattedPeriod;
  const quarterLabel = getQuarterLabel(period);
  return `${quarterLabel}, ${formattedPeriod}`;
};

export const getConcisePeriodLabel = (period, forecastPeriodType) => {
  const formattedPeriod = formatPeriodLabel(period);
  if (forecastPeriodType === R3M_VIEW) return formattedPeriod;
  return getQuarterLabel(period);
};
