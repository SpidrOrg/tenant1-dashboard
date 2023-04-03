import postApiBase from '../postApiBase';
export default async function ({
  userId,
  userDisplayName,
  action,
  asOn,
  comment,
  periodStartDate,
  periodEndDate,
  customer,
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
    customer,
    category,
    byValueOrByVolume,
    forecastPeriodType,
  });

  return data;
}
