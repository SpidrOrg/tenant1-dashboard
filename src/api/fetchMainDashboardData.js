import _ from "lodash";
import apiBase from "@/api/getApiBase";
const apiResp1 = [
  {
    "Mar 23 - May 23": {
      "metrics": {
        "marketSensingGrowth": "-29.51854395211874",
        "jdaGrowth": "5.996592046170912",
        "pyGrowth": "20.166481724361805",
        "impliedGrowth": "-7.619208399793104",
        "keyDemandDrivers": [{
          "Stock Market": 33
        }, {
          "Inflation": 23
        }, {
          "Per capita disposable income": 17
        }, {
          "Pandemic": 9
        }, {
          "Consumer behaviour": 4
        }, {
          "Loans consumption": 3
        }],
        "historical": [{
          "period": "May22 - Jul22",
          "Market Sensing": 17,
          "Internal": 25,
          "Actual": 21
        },{
          "period": "Jun22 - Aug22",
          "Market Sensing": 23,
          "Internal": 12,
          "Actual": 19
        },{
          "period": "Jul22 - Sep22",
          "Market Sensing": 9,
          "Internal": 36,
          "Actual": 12
        },{
          "period": "Aug22 - Oct22",
          "Market Sensing": 13,
          "Internal": 31,
          "Actual": 14
        },{
          "period": "Sep22 - Nov22",
          "Market Sensing": 18,
          "Internal": 36,
          "Actual": 34
        },{
          "period": "Oct22 - Dec22",
          "Market Sensing": 10,
          "Internal": 32,
          "Actual": 21
        }]
      },
      "futureLagMonths": "1-3",
      "modelAccuracy": "99"
    }
  },
  {
    "Jun 23 - Aug 23": {
      "metrics": {
        "marketSensingGrowth": "-19.51854395211874",
        "jdaGrowth": "5.996592046170912",
        "pyGrowth": "20.166481724361805",
        "impliedGrowth": "-7.619208399793104",
        "keyDemandDrivers": [{
          "Stock Market": 44
        }, {
          "Inflation": 23
        }, {
          "Per capita disposable income": 17
        }, {
          "Pandemic": 9
        }, {
          "Consumer behaviour": 4
        }, {
          "Loans consumption": 3
        }],
        "historical": [{
          "period": "May22 - Jul22",
          "Market Sensing": 17,
          "Internal": 25,
          "Actual": 21
        },{
          "period": "Jun22 - Aug22",
          "Market Sensing": 23,
          "Internal": 12,
          "Actual": 19
        },{
          "period": "Jul22 - Sep22",
          "Market Sensing": 9,
          "Internal": 36,
          "Actual": 12
        },{
          "period": "Aug22 - Oct22",
          "Market Sensing": 13,
          "Internal": 31,
          "Actual": 14
        },{
          "period": "Sep22 - Nov22",
          "Market Sensing": 18,
          "Internal": 36,
          "Actual": 34
        },{
          "period": "Oct22 - Dec22",
          "Market Sensing": 10,
          "Internal": 32,
          "Actual": 21
        }]
      },
      "futureLagMonths": "4-6",
      "modelAccuracy": "63"
    }
  },
  {
    "Sep 23 - Nov 23": {
      "metrics": {
        "marketSensingGrowth": "-19.51854395211874",
        "jdaGrowth": "5.996592046170912",
        "pyGrowth": "20.166481724361805",
        "impliedGrowth": "-7.619208399793104",
        "keyDemandDrivers": [{
          "Stock Market": 44
        }, {
          "Inflation": 23
        }, {
          "Per capita disposable income": 17
        }, {
          "Pandemic": 9
        }, {
          "Consumer behaviour": 4
        }, {
          "Loans consumption": 3
        }],
        "historical": [{
          "period": "May22 - Jul22",
          "Market Sensing": 17,
          "Internal": 25,
          "Actual": 21
        },{
          "period": "Jun22 - Aug22",
          "Market Sensing": 23,
          "Internal": 12,
          "Actual": 19
        },{
          "period": "Jul22 - Sep22",
          "Market Sensing": 9,
          "Internal": 36,
          "Actual": 12
        },{
          "period": "Aug22 - Oct22",
          "Market Sensing": 13,
          "Internal": 31,
          "Actual": 14
        },{
          "period": "Sep22 - Nov22",
          "Market Sensing": 18,
          "Internal": 36,
          "Actual": 34
        },{
          "period": "Oct22 - Dec22",
          "Market Sensing": 10,
          "Internal": 32,
          "Actual": 21
        }]
      },
      "futureLagMonths": "7-9",
      "modelAccuracy": "12"
    }
  }
]
const apiResp = [
  {
    "Mar 23 - May 23": {
      "metrics": {
        "marketSensingGrowth": null,
        "jdaGrowth": null,
        "pyGrowth": null,
        "impliedGrowth": null,
        "keyDemandDrivers": [
          {
            "": 0
          }
        ],
        "historical": [
          {
            "period": "Jan 23 - Nov 22",
            "Market Sensing": null,
            "Internal": null,
            "Actual": null
          },
          {
            "period": "Dec 22 - Oct 22",
            "Market Sensing": null,
            "Internal": null,
            "Actual": null
          },
          {
            "period": "Nov 22 - Sep 22",
            "Market Sensing": null,
            "Internal": null,
            "Actual": null
          },
          {
            "period": "Oct 22 - Aug 22",
            "Market Sensing": null,
            "Internal": null,
            "Actual": null
          },
          {
            "period": "Sep 22 - Jul 22",
            "Market Sensing": null,
            "Internal": null,
            "Actual": null
          },
          {
            "period": "Aug 22 - Jun 22",
            "Market Sensing": null,
            "Internal": null,
            "Actual": null
          }
        ]
      },
      "futureLagMonths": "1-3",
      "modelAccuracy": "95"
    }
  },
  {
    "Jun 23 - Aug 23": {
      "metrics": {
        "marketSensingGrowth": null,
        "jdaGrowth": null,
        "pyGrowth": null,
        "impliedGrowth": null,
        "keyDemandDrivers": [
          {
            "": 0
          }
        ],
        "historical": [
          {
            "period": "Jan 23 - Nov 22",
            "Market Sensing": null,
            "Internal": null,
            "Actual": null
          },
          {
            "period": "Dec 22 - Oct 22",
            "Market Sensing": null,
            "Internal": null,
            "Actual": null
          },
          {
            "period": "Nov 22 - Sep 22",
            "Market Sensing": null,
            "Internal": null,
            "Actual": null
          },
          {
            "period": "Oct 22 - Aug 22",
            "Market Sensing": null,
            "Internal": null,
            "Actual": null
          },
          {
            "period": "Sep 22 - Jul 22",
            "Market Sensing": null,
            "Internal": null,
            "Actual": null
          },
          {
            "period": "Aug 22 - Jun 22",
            "Market Sensing": null,
            "Internal": null,
            "Actual": null
          }
        ]
      },
      "futureLagMonths": "4-6",
      "modelAccuracy": "88"
    }
  },
  {
    "Sep 23 - Nov 23": {
      "metrics": {
        "marketSensingGrowth": null,
        "jdaGrowth": null,
        "pyGrowth": null,
        "impliedGrowth": null,
        "keyDemandDrivers": [
          {
            "": 0
          }
        ],
        "historical": [
          {
            "period": "Jan 23 - Nov 22",
            "Market Sensing": null,
            "Internal": null,
            "Actual": null
          },
          {
            "period": "Dec 22 - Oct 22",
            "Market Sensing": null,
            "Internal": null,
            "Actual": null
          },
          {
            "period": "Nov 22 - Sep 22",
            "Market Sensing": null,
            "Internal": null,
            "Actual": null
          },
          {
            "period": "Oct 22 - Aug 22",
            "Market Sensing": null,
            "Internal": null,
            "Actual": null
          },
          {
            "period": "Sep 22 - Jul 22",
            "Market Sensing": null,
            "Internal": null,
            "Actual": null
          },
          {
            "period": "Aug 22 - Jun 22",
            "Market Sensing": null,
            "Internal": null,
            "Actual": null
          }
        ]
      },
      "futureLagMonths": "7-9",
      "modelAccuracy": "92"
    }
  },
  {
    "Dec 23 - Feb 24": {
      "metrics": {
        "marketSensingGrowth": null,
        "jdaGrowth": null,
        "pyGrowth": null,
        "impliedGrowth": null,
        "keyDemandDrivers": [
          {
            "": 0
          }
        ],
        "historical": [
          {
            "period": "Jan 23 - Nov 22",
            "Market Sensing": null,
            "Internal": null,
            "Actual": null
          },
          {
            "period": "Dec 22 - Oct 22",
            "Market Sensing": null,
            "Internal": null,
            "Actual": null
          },
          {
            "period": "Nov 22 - Sep 22",
            "Market Sensing": null,
            "Internal": null,
            "Actual": null
          },
          {
            "period": "Oct 22 - Aug 22",
            "Market Sensing": null,
            "Internal": null,
            "Actual": null
          },
          {
            "period": "Sep 22 - Jul 22",
            "Market Sensing": null,
            "Internal": null,
            "Actual": null
          },
          {
            "period": "Aug 22 - Jun 22",
            "Market Sensing": null,
            "Internal": null,
            "Actual": null
          }
        ]
      },
      "futureLagMonths": "10-12",
      "modelAccuracy": "92"
    }
  }
]

export default async function (
  {
    marketSensingRefreshDate,
    categories,
    customers,
    valueORvolume
  }) {
  const data = await apiBase('maindashboard', {
    marketSensingRefreshDate,
    categories,
    customers,
    valueORvolume
  });

  // const data = await new Promise((res)=>{
  //   setTimeout(()=>{
  //     res({result: apiResp})
  //   }, 100)
  // })
  let dataForUi = _.get(data, "result", {})
  _.forEach(dataForUi, v => {
    const periodData = _.get(_.values(v), "[0]");
    periodData.modelAccuracy = _.toNumber(periodData.modelAccuracy);
    const metricsObj = _.get(periodData, "metrics");
    _.forOwn(metricsObj, (v, k)=>{
      if (!(k === "historical" || k === "keyDemandDrivers")){
        metricsObj[k] = v === null ? "NA" : _.round(_.toNumber(v), 0)
      }
    })
  })
  return dataForUi;
}
