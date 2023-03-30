import getApiBase from '../getApiBase';

export default async function ({
  refreshDate,
  customer,
  category,
  valueOrQuantity,
  periodStart,
  periodEnd,
}) {
  const data = await getApiBase('reviews', {
    refreshDate,
    customer,
    category,
    valueOrQuantity,
    periodStart,
    periodEnd,
  });

  let dataForUi = data;
  return dataForUi;
}
