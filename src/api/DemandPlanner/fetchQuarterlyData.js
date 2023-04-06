import _ from 'lodash';
import { format as formatFn, startOfQuarter, startOfMonth, add } from 'date-fns';
import apiBase from "@/api/getApiBase";
// import apiBase from '@/api/getApiBase';

const apiRes = [
  {
    'Jan 23 - Mar 23': {
      metrics: {
        marketSensingGrowth: 19.94,
        jdaGrowth: -20.92,
        pyGrowth: 21.16,
        impliedGrowth: -20.13,
        keyDemandDrivers: [
          {
            '12m_Prices, Producer Price Index, PPI: Intermediate Demand, Stage 3, Foods (Nov. 2009), NSA - United States': 77.99,
          },
          {
            'Prices, Producer Price Index, PPI: Intermediate Demand, Stage 3, Foods (Nov. 2009), NSA - United States': 18.84,
          },
          {
            '12m_Prices, Producer Price Index, PPI: Intermediate Demand, Stage 3, Foods (Nov. 2009), NSA - United States': 17.52,
          },
          {
            '12m_Prices, Producer Price Index, PPI: Commodity Data, Securities Brokerage and Dealing Related Services (Dec. 2008), NSA - United States': 16.86,
          },
          {
            'Prices, Producer Price Index, PPI: Commodity Data, Final Demand, Pork (1982), NSA - United States': 15.35,
          },
          {
            '12m_Prices, Producer Price Index, PPI: Commodity Data, Final Demand, Pork (1982), NSA - United States': 12.6,
          },
        ],
        historical: [
          {
            period: 'Jan 23 - Nov 22',
            'Market Sensing': 11.51,
            Internal: -64.87,
            Actual: 36.59,
            Adjusted: -64.87,
          },
          {
            period: 'Dec 22 - Oct 22',
            'Market Sensing': 16.51,
            Internal: null,
            Actual: 36.59,
            Adjusted: null,
          },
          {
            period: 'Nov 22 - Sep 22',
            'Market Sensing': 31.14,
            Internal: null,
            Actual: null,
            Adjusted: null,
          },
          {
            period: 'Oct 22 - Aug 22',
            'Market Sensing': 27.93,
            Internal: null,
            Actual: null,
            Adjusted: null,
          },
          {
            period: 'Sep 22 - Jul 22',
            'Market Sensing': 26.41,
            Internal: null,
            Actual: null,
            Adjusted: null,
          },
          {
            period: 'Aug 22 - Jun 22',
            'Market Sensing': 19.64,
            Internal: -71.2,
            Actual: -37.71,
            Adjusted: -71.2,
          },
        ],
      },
      futureLagMonths: '1-3',
      modelAccuracy: '87',
    },
  },
  {
    'Apr 23 - Jun 23': {
      metrics: {
        marketSensingGrowth: 19.86,
        jdaGrowth: null,
        pyGrowth: 22.91,
        impliedGrowth: null,
        keyDemandDrivers: [
          {
            '12m_Prices, Producer Price Index, PPI: Industry Data, Rendering and Meat Byproduct Processing, Lard, Inedible Tallow and other Greases excluding Wool Grease (Dec. 1982), NSA - United States': 50.67,
          },
          {
            'Prices, Producer Price Index, PPI: Industry Data, All other Petroleum and Coal Products Manufacturing, Primary Products (Dec. 2003), NSA - United States': 27.38,
          },
          {
            '6m_Prices, Producer Price Index, PPI: Industry Data, Rendering and Meat Byproduct Processing, Lard, Inedible Tallow and other Greases excluding Wool Grease (Dec. 1982), NSA - United States': 22.87,
          },
          {
            '12m_Prices, Producer Price Index, PPI: Commodity Data, Residential Natural Gas (Dec. 1990), NSA - United States': 19.53,
          },
          {
            '6m_Prices, Producer Price Index, PPI: Commodity Data, Chemicals and Allied Products, Mixed Fertilizers (1982), NSA - United States': 19.24,
          },
          {
            '12m_Prices, Producer Price Index, PPI: Commodity Data, Final Demand, Residential Natural Gas (Dec. 1990), NSA - United States': 19.06,
          },
        ],
        historical: [
          {
            period: 'Jan 23 - Nov 22',
            'Market Sensing': 9.46,
            Internal: null,
            Actual: null,
            Adjusted: null,
          },
          {
            period: 'Dec 22 - Oct 22',
            'Market Sensing': 14.5,
            Internal: null,
            Actual: null,
            Adjusted: null,
          },
          {
            period: 'Nov 22 - Sep 22',
            'Market Sensing': 24.39,
            Internal: null,
            Actual: 36.59,
            Adjusted: null,
          },
          {
            period: 'Oct 22 - Aug 22',
            'Market Sensing': 25.14,
            Internal: -51.03,
            Actual: 36.59,
            Adjusted: -51.03,
          },
          {
            period: 'Sep 22 - Jul 22',
            'Market Sensing': 25.56,
            Internal: -77.1,
            Actual: 36.59,
            Adjusted: -77.1,
          },
          {
            period: 'Aug 22 - Jun 22',
            'Market Sensing': 17.17,
            Internal: null,
            Actual: null,
            Adjusted: null,
          },
        ],
      },
      futureLagMonths: '4-6',
      modelAccuracy: '95',
    },
  },
  {
    'Jul 23 - Sep 23': {
      metrics: {
        marketSensingGrowth: 31.16,
        jdaGrowth: -58.74,
        pyGrowth: 19.22,
        impliedGrowth: -34.51,
        keyDemandDrivers: [
          {
            '6m_Prices, Producer Price Index, PPI: Industry Data, Soybean and other Oilseed Processing, Soybean Oil (Dec. 1979), NSA - United States': 29.84,
          },
          {
            '12m_Prices, Producer Price Index, PPI: Commodity Data, Semifinished Steel Mill Products (Jun. 1982), NSA - United States': 19.16,
          },
          {
            '6m_Prices, Consumer Price Index, CPI: All Urban Consumers, Medical Care (1982-84), NSA - United States': 17.1,
          },
          {
            '6m_Prices, Producer Price Index, PPI: Commodity Data, Asphalt and other Petroleum and Coal Products, N.E.C. (Dec. 1984), NSA - United States': 14.11,
          },
          {
            '12m_Prices, Producer Price Index, PPI: Industry Data, Natural Gas Distribution, Primary Products (Dec. 1990), NSA - United States': 12.79,
          },
          {
            '12m_Prices, Producer Price Index, PPI: Industry Data, Natural Gas Distribution, Primary Products (Dec. 1990), NSA - United States': 11.64,
          },
        ],
        historical: [
          {
            period: 'Jan 23 - Nov 22',
            'Market Sensing': 20.24,
            Internal: -91,
            Actual: null,
            Adjusted: -91,
          },
          {
            period: 'Dec 22 - Oct 22',
            'Market Sensing': 18.36,
            Internal: null,
            Actual: null,
            Adjusted: null,
          },
          {
            period: 'Nov 22 - Sep 22',
            'Market Sensing': 38.41,
            Internal: null,
            Actual: null,
            Adjusted: null,
          },
          {
            period: 'Oct 22 - Aug 22',
            'Market Sensing': 30.13,
            Internal: null,
            Actual: null,
            Adjusted: null,
          },
          {
            period: 'Sep 22 - Jul 22',
            'Market Sensing': 32.48,
            Internal: null,
            Actual: null,
            Adjusted: null,
          },
          {
            period: 'Aug 22 - Jun 22',
            'Market Sensing': 13.45,
            Internal: -20.92,
            Actual: 36.59,
            Adjusted: -20.92,
          },
        ],
      },
      futureLagMonths: '7-9',
      modelAccuracy: '95',
    },
  },
  {
    'Oct 23 - Dec 23': {
      metrics: {
        marketSensingGrowth: 33.47,
        jdaGrowth: null,
        pyGrowth: 22.55,
        impliedGrowth: null,
        keyDemandDrivers: [
          {
            '12m_Prices, Producer Price Index, PPI: Commodity Data, Fuels and Related Products and Power, Gas Fuels (1982), NSA - United States': 43.05,
          },
          {
            '12m_Prices, Producer Price Index, PPI: Industry Data, Natural Gas Distribution, Natural Gas to Ultimate Consumers (Dec. 1990), NSA - United States': 37.08,
          },
          {
            'Prices, Producer Price Index, PPI: Industry Data, Material Recyclers, Primary Products (Dec. 1986), NSA - United States': 35.23,
          },
          {
            '12m_Prices, Producer Price Index, PPI: Commodity Data, Fuels and Related Products and Power, Gas Fuels (1982), NSA - United States': 34.85,
          },
          {
            '6m_Prices, Producer Price Index, PPI: Industry Data, Natural Gas Liquids Extraction, Residue Gas Shipped from Natural Gas Liquids Plants (Jun. 1984), NSA - United States': 20.81,
          },
          {
            '12m_Prices, Producer Price Index, PPI: Industry Data, Natural Gas Distribution, Primary Products (Dec. 1990), NSA - United States': 19.53,
          },
        ],
        historical: [
          {
            period: 'Jan 23 - Nov 22',
            'Market Sensing': 15.29,
            Internal: null,
            Actual: null,
            Adjusted: null,
          },
          {
            period: 'Dec 22 - Oct 22',
            'Market Sensing': 15.2,
            Internal: null,
            Actual: null,
            Adjusted: null,
          },
          {
            period: 'Nov 22 - Sep 22',
            'Market Sensing': 34,
            Internal: null,
            Actual: null,
            Adjusted: null,
          },
          {
            period: 'Oct 22 - Aug 22',
            'Market Sensing': 35.56,
            Internal: -68.33,
            Actual: null,
            Adjusted: -68.33,
          },
          {
            period: 'Sep 22 - Jul 22',
            'Market Sensing': 37.19,
            Internal: -89.45,
            Actual: null,
            Adjusted: -89.45,
          },
          {
            period: 'Aug 22 - Jun 22',
            'Market Sensing': 12.16,
            Internal: null,
            Actual: null,
            Adjusted: null,
          },
        ],
      },
      futureLagMonths: '10-12',
      modelAccuracy: '93',
    },
  },
];

export default async function ({
                                 categories,
                                 customers,
                                 valueORvolume,
                               }) {
  const data = await apiBase('maindashboard', {
    marketSensingRefreshDate: formatFn(startOfMonth(add(startOfQuarter(new Date()), {days: -1})), "yyyy-MM-dd"),
    categories,
    customers,
    valueORvolume,
  });

  // const data = await new Promise((res)=>{
  //   setTimeout(()=>{
  //     res({result: apiRes})
  //   }, 100)
  // })
  let dataForUi = _.get(data, 'result', {});
  _.forEach(dataForUi, (v) => {
    const periodData = _.get(_.values(v), '[0]');
    periodData.modelAccuracy = _.toNumber(periodData.modelAccuracy);
    const metricsObj = _.get(periodData, 'metrics');
    _.forOwn(metricsObj, (v, k) => {
      if (!(k === 'historical' || k === 'keyDemandDrivers')) {
        metricsObj[k] = v === null ? 'NA' : _.round(_.toNumber(v), 0);
      }
    });
  });
  return dataForUi;
}
