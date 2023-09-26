import _ from 'lodash';
import apiBase from '@/api/getApiBase';
const apiRes = [
  {
    "Jul 21": {
      "metrics": {
        "marketSensingGrowth": 29.54537430114768,
        "jdaGrowth": 23,
        "pyGrowth": 11.84,
        "impliedGrowth": null,
        "keyDemandDrivers": [
          {
            "Consumption Activity": 54.4
          },
          {
            "Production Activity": 28.4
          },
          {
            "Overall Economic Health": 8.5
          },
          {
            "Dependent Variable": 6.4
          },
          {
            "undefined": 1.8
          },
          {
            "Consumer Demand": 0.5
          }
        ],
        "historical": [
          {
            "period": "Dec 20",
            "Market Sensing": 27.654394270233993,
            "Internal": null,
            "Actual": 67.01,
            "Adjusted": null
          },
          {
            "period": "Jan 21",
            "Market Sensing": 28.48652799622832,
            "Internal": null,
            "Actual": 64.29,
            "Adjusted": null
          },
          {
            "period": "Feb 21",
            "Market Sensing": 27.053079288549505,
            "Internal": null,
            "Actual": 49.49,
            "Adjusted": null
          },
          {
            "period": "Mar 21",
            "Market Sensing": 28.841030837789255,
            "Internal": null,
            "Actual": 131.27,
            "Adjusted": null
          },
          {
            "period": "Apr 21",
            "Market Sensing": 14.74859573698381,
            "Internal": null,
            "Actual": 10.68,
            "Adjusted": null
          },
          {
            "period": "May 21",
            "Market Sensing": 24.949510807687144,
            "Internal": null,
            "Actual": 18.44,
            "Adjusted": null
          }
        ]
      },
      "horizon": "1m"
    }
  },
  {
    "Aug 21": {
      "metrics": {
        "marketSensingGrowth": 17.677189484265824,
        "jdaGrowth": 88,
        "pyGrowth": 12.39,
        "impliedGrowth": null,
        "keyDemandDrivers": [],
        "historical": [
          {
            "period": "Dec 20",
            "Market Sensing": 24.116004467770278,
            "Internal": null,
            "Actual": 64.29,
            "Adjusted": null
          },
          {
            "period": "Jan 21",
            "Market Sensing": 11.00727502711023,
            "Internal": null,
            "Actual": 49.49,
            "Adjusted": null
          },
          {
            "period": "Feb 21",
            "Market Sensing": 26.65843254700704,
            "Internal": null,
            "Actual": 131.27,
            "Adjusted": null
          },
          {
            "period": "Mar 21",
            "Market Sensing": 6.363231802980398,
            "Internal": null,
            "Actual": 10.68,
            "Adjusted": null
          },
          {
            "period": "Apr 21",
            "Market Sensing": 14.688836786988135,
            "Internal": null,
            "Actual": 18.44,
            "Adjusted": null
          },
          {
            "period": "May 21",
            "Market Sensing": -1.661906952157408,
            "Internal": null,
            "Actual": 19.88,
            "Adjusted": null
          }
        ]
      },
      "horizon": "2m"
    }
  },
  {
    "Sep 21": {
      "metrics": {
        "marketSensingGrowth": 17.677189484265824,
        "jdaGrowth": 44,
        "pyGrowth": 13.92,
        "impliedGrowth": null,
        "keyDemandDrivers": [
          {
            "Production Activity": 42.2
          },
          {
            "Consumption Activity": 34.6
          },
          {
            "POS": 10.3
          },
          {
            "Overall Economic Health": 7.4
          },
          {
            "Financial Activity": 4
          },
          {
            "Consumer Demand": 1.1
          },
          {
            "Commercial Spending": 0.2
          }
        ],
        "historical": [
          {
            "period": "Dec 20",
            "Market Sensing": 24.116004467770278,
            "Internal": null,
            "Actual": 49.49,
            "Adjusted": null
          },
          {
            "period": "Jan 21",
            "Market Sensing": 11.00727502711023,
            "Internal": null,
            "Actual": 131.27,
            "Adjusted": null
          },
          {
            "period": "Feb 21",
            "Market Sensing": 26.65843254700704,
            "Internal": null,
            "Actual": 10.68,
            "Adjusted": null
          },
          {
            "period": "Mar 21",
            "Market Sensing": 6.363231802980398,
            "Internal": null,
            "Actual": 18.44,
            "Adjusted": null
          },
          {
            "period": "Apr 21",
            "Market Sensing": 14.688836786988135,
            "Internal": null,
            "Actual": 19.88,
            "Adjusted": null
          },
          {
            "period": "May 21",
            "Market Sensing": -1.661906952157408,
            "Internal": null,
            "Actual": 49.48,
            "Adjusted": null
          }
        ]
      },
      "horizon": "3m"
    }
  },
  {
    "Oct 21": {
      "metrics": {
        "marketSensingGrowth": -93.53426541746668,
        "jdaGrowth": -92,
        "pyGrowth": 11.64,
        "impliedGrowth": null,
        "keyDemandDrivers": [],
        "historical": [
          {
            "period": "Dec 20",
            "Market Sensing": 19.15361056529874,
            "Internal": null,
            "Actual": 131.27,
            "Adjusted": null
          },
          {
            "period": "Jan 21",
            "Market Sensing": 20.614025422470423,
            "Internal": null,
            "Actual": 10.68,
            "Adjusted": null
          },
          {
            "period": "Feb 21",
            "Market Sensing": 19.59075607010757,
            "Internal": null,
            "Actual": 18.44,
            "Adjusted": null
          },
          {
            "period": "Mar 21",
            "Market Sensing": 38.73087321842753,
            "Internal": null,
            "Actual": 19.88,
            "Adjusted": null
          },
          {
            "period": "Apr 21",
            "Market Sensing": 1607.7707508710494,
            "Internal": null,
            "Actual": 49.48,
            "Adjusted": null
          },
          {
            "period": "May 21",
            "Market Sensing": 27.887862418422436,
            "Internal": null,
            "Actual": 234.37,
            "Adjusted": null
          }
        ]
      },
      "horizon": "4m"
    }
  },
  {
    "Nov 21": {
      "metrics": {
        "marketSensingGrowth": 21.339058515479504,
        "jdaGrowth": 20,
        "pyGrowth": 13.76,
        "impliedGrowth": null,
        "keyDemandDrivers": [],
        "historical": [
          {
            "period": "Dec 20",
            "Market Sensing": 19.170578811717366,
            "Internal": null,
            "Actual": 10.68,
            "Adjusted": null
          },
          {
            "period": "Jan 21",
            "Market Sensing": 20.136306348582682,
            "Internal": null,
            "Actual": 18.44,
            "Adjusted": null
          },
          {
            "period": "Feb 21",
            "Market Sensing": 32.549664834564865,
            "Internal": null,
            "Actual": 19.88,
            "Adjusted": null
          },
          {
            "period": "Mar 21",
            "Market Sensing": 671.8088007867658,
            "Internal": null,
            "Actual": 49.48,
            "Adjusted": null
          },
          {
            "period": "Apr 21",
            "Market Sensing": 28.49905609984375,
            "Internal": null,
            "Actual": 234.37,
            "Adjusted": null
          },
          {
            "period": "May 21",
            "Market Sensing": 24.002986628774778,
            "Internal": null,
            "Actual": 74.35,
            "Adjusted": null
          }
        ]
      },
      "horizon": "5m"
    }
  },
  {
    "Dec 21": {
      "metrics": {
        "marketSensingGrowth": -27.34691039433985,
        "jdaGrowth": null,
        "pyGrowth": 14.46,
        "impliedGrowth": null,
        "keyDemandDrivers": [
          {
            "Production Activity": 34.1
          },
          {
            "Consumption Activity": 32.8
          },
          {
            "POS": 21.7
          },
          {
            "Climate Disruptions": 4.3
          },
          {
            "Financial Activity": 4.1
          },
          {
            "Overall Economic Health": 2.5
          },
          {
            "undefined": 0.5
          }
        ],
        "historical": [
          {
            "period": "Dec 20",
            "Market Sensing": 19.11444331091925,
            "Internal": null,
            "Actual": 18.44,
            "Adjusted": null
          },
          {
            "period": "Jan 21",
            "Market Sensing": 17.587311461164084,
            "Internal": null,
            "Actual": 19.88,
            "Adjusted": null
          },
          {
            "period": "Feb 21",
            "Market Sensing": 22.431151631525392,
            "Internal": null,
            "Actual": 49.48,
            "Adjusted": null
          },
          {
            "period": "Mar 21",
            "Market Sensing": 14.456892802149927,
            "Internal": null,
            "Actual": 234.37,
            "Adjusted": null
          },
          {
            "period": "Apr 21",
            "Market Sensing": 280.5341185253039,
            "Internal": null,
            "Actual": 74.35,
            "Adjusted": null
          },
          {
            "period": "May 21",
            "Market Sensing": 7.607129457751764,
            "Internal": null,
            "Actual": 31.53,
            "Adjusted": null
          }
        ]
      },
      "horizon": "6m"
    }
  }
]

export default async function ({
  marketSensingRefreshDate,
  categories,
  customers,
  valueORvolume,
}) {
  // const data = await apiBase('maindashboardmonthly', {
  //   marketSensingRefreshDate,
  //   categories,
  //   customers,
  //   valueORvolume,
  // });

  const data = await new Promise((res) => {
    setTimeout(() => {
      res({ result: apiRes });
    }, 100);
  });
  let dataForUi = _.cloneDeep(_.get(data, 'result', {}));
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
