import getApiBase from './getApiBase';

let cachedData = [
  ['Time Period', 'Market Sensing', 'Internal', 'Sales'],
  ['Jun 22 - Aug 22', 12, 33, 44],
  ['Aug 22 - Oct 22', 55, 70, 40],
  ['Sep 22 - Nov 22', 13, 66, 20],
  ['Oct 22 - Dec 22', 24, 30, 54],
  ['Nov 22 - Jan 23', 55, 70, 40],
  ['Dec 22 - Feb 23', 13, 66, 20],
  ['Jan 23 - Mar 23', 24, 10, 40],
  ['Feb 23 - Apr 23', 55, 11, 4],
  ['Mar 23 - May 23', 13, 60, 90],
  ['Apr 23 - Jun 23', 24, 30, 50],
  ['May 23 - Jul 23', 13, 10, 4],
];

export default async function ({ category, customer, period }) {
  if (cachedData) {
    return await new Promise((res) => {
      setTimeout(() => {
        res(cachedData);
      }, 1300);
    });
  }

  const data = getApiBase('demandforecast', {
    category,
    customer,
    period,
  });

  return data;
}
