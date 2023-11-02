import postApiBase from '../postApiBase';

export default async function ({
  userId,
  userDisplayName,
  action,
  asOn,
  comment,
  periodStartDate,
  periodEndDate,
  splits,
  category,
  byValueOrByVolume,
  forecastPeriodType,
}) {
  const data = await postApiBase('reviews', {
    userId,
    userDisplayName,
    action,
    asOn,
    comment,
    periodStartDate,
    periodEndDate,
    customer: splits,
    category,
    byValueOrByVolume,
    forecastPeriodType,
    invalidate: `${Date.now()}`
  });

  return data;
}
