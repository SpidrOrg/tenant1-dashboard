<script>
import { GChart }  from 'vue-google-charts'
import fetchMainDashboardData from "@/api/fetchMainDashboardData";
import {data} from "autoprefixer";
import _ from 'lodash';
export default {
  name: "DemandPlanner",
  components: {
    GChart
  },

  data(){
    return{
      apiData:{},
      chartDataLoaded:false,
      projectionMonth:'',
      barChartOptions:{
        legend: {position: 'bottom'},
        colors: ['#646F79']
      },
      columnChartOptions:{
        legend: {position: 'top'},
        colors: ['#570EAA', '#787878', '#C8A5F0', '#F4BE37']
      },
      impliedMarketChartData:{},
      barChartData:{},
      columnChartData:[],
      activeCard: 1,
      impliedMarketChartOptions : {
        //chart: {
        //title: 'Implied Market Share',
        legend: {position: 'bottom'},
        colors: ['#A5A5A5', '#F8D887']
        //}
      },
      first_quarter:true,
      second_quarter:false,
      third_quarter:false,
      fourth_quarter:false,
      show_array:['show','hide','hide','hide']
    }
  },
  async created(){
   this.apiData = await fetchMainDashboardData();
   console.log(this.apiData);
   this.chartDataLoaded = true
    this.activeCard = 0;
  },
  methods:{
    activeEl(ind) {
      this.activeCard = ind
      //alert(this.activeCard);
    },
    colorBtnFunc(n) {
      if (n <= -20 || n >= 20) {
        return '#FF3429B2';
      } else if (n >= -5 || n <= 5) {
        return '#04BB46';
      } else if (-20 <= n <= -6 || 6 <= n <= 20) {
        return '#FFC107B2';
      }
    }
  },
  watch:{
    activeCard(oldValue, newValue){
      //alert(oldValue);
      let currentCard = _.get(this.apiData, `${oldValue}.externalKPIs`);
      let currentCardPy = _.get(this.apiData, `${oldValue}.impliedMarketShare`);
      let currentCardHistorical = _.get(this.apiData, `${oldValue}.historical`);
      let historicalIdentifiers = currentCardHistorical.identifiers;
      this.projectionMonth = _.get(this.apiData, `${oldValue}.period`);
      this.barChartData= [
        ['X', 'Y'],
        ['Stock Market', currentCard['Stock market']],
        ['Inflation', currentCard['Inflation']],
        ["Mooddy's", currentCard['Per-capita disposable income']],
        ['Pandemic', currentCard['Pandemic']],
        ['Consumer behaviour', currentCard['Consumer behaviour']],
        ['Loans consumption', currentCard['Loans consumption']]
      ]
      this.impliedMarketChartData = [
        ['', 'Implied', 'PyActual'],
        ['', currentCardPy['implied'], currentCardPy['pyActual']],
      ]
      this.columnChartData = [];
      this.columnChartData.push(historicalIdentifiers);
      let v= this;
      _.forEach(currentCardHistorical.data, function(data){
        v.columnChartData.push(data);
      })
    },
    first_quarter(oldValue,newValue){
      this.show_array[0] = (oldValue) ? 'show' : 'hide';
    },
    second_quarter(oldValue,newValue){
      this.show_array[1] = (oldValue) ? 'show' : 'hide';
    },
    third_quarter(oldValue,newValue){
      this.show_array[2] = (oldValue) ? 'show' : 'hide';
    },
    fourth_quarter(oldValue,newValue){
      this.show_array[3] = (oldValue) ? 'show' : 'hide';
    },

  }
};


</script>

<template>
  <v-progress-circular indeterminate color="#7823DC" v-if="!chartDataLoaded" :size="70" :width="7" style="position: fixed;
    left: 50%;
    top: 35%;
  z-index: 1000;"/>
  <div class="tw-flex tw-w-full tw-h-8 tw-bg-brand-gray-1">

    <div class="tw-flex tw-h-full tw-items-center tw-font-bold">
      Demand Planner Dashboard as of Jan 2023
    </div>
    <div class="tw-ml-auto tw-h-full tw-flex tw-items-center">
      Last Refreshed
    </div>
  </div>
  <div class="tw-flex tw-w-full tw-flex-auto tw-border-t tw-border-solid tw-border-brand-gray-2" v-if="chartDataLoaded">
    <div class="tw-flex tw-align-center tw-grid tw-grid-cols-4 tw-gap-2.5 tw-m-2">
      <div>
        <v-checkbox
          label="1-3 months (Default)"
          color="#7823DC"
          hide-details
          v-model="first_quarter"
          :disabled=true
        ></v-checkbox>
      </div>
      <div>
        <v-checkbox
          label="4-6 months"
          color="#7823DC"
          hide-details
          v-model="second_quarter"
        ></v-checkbox>
      </div>
      <div>
        <v-checkbox
          label="6-9 months"
          color="#7823DC"
          hide-details
          v-model="third_quarter"
        ></v-checkbox>
      </div>
      <div>
        <v-checkbox
          label="10-12 months"
          color="#7823DC"
          hide-details
          v-model="fourth_quarter"
        ></v-checkbox>
      </div>
    </div>
  </div>
  <div class="tw-flex tw-w-full tw-flex-auto tw-border-t tw-border-solid tw-border-brand-gray-2" v-if="chartDataLoaded">
      <div class="tw-grid tw-grid-cols-4 tw-gap-2.5 tw-m-2" v-if="chartDataLoaded && apiData.length">
        <v-card v-for="(data, index) in apiData" :key="data.period" @click="activeEl(index)" :style="(activeCard == index) ? 'border:1px solid #7823DC': '' ">
          <v-container>
            <div class="tw-grid tw-grid-cols-2 tw-mb-2">
              <div>
                <p class="projectedPeriod">Projected Period</p>
                <h3 class="periodDates">{{ data.period }}</h3>
              </div>
              <div style="display: flex;
flex-direction: row;
justify-content: center;
align-items: center;
padding: 5px;
background: #EDEDED;
border-radius: 4px;">
                <span class="monthsLag">{{ data.lag }} Months Lag</span>
              </div>
              <v-divider/>
            </div>
            <div class="tw-grid tw-grid-cols-2">
              <div>
                <h4 class="tw-font-bold" style="font-size: 15px">Projected Growth (%YoY)</h4>
                <h2 class="varianceText" :style="{'color': colorBtnFunc(data.variance)}">{{ `${data.variance}%` }}</h2>
                <span style="font-size: 10px">Variance</span>
                <v-divider/>
                <div class="tw-grid tw-grid-cols-2 tw-mt-3">
                  <div>
                    <h4 class="headings">{{ `${data.marketSensing}%` }}</h4>
                    <span style="font-size: 10px">Market Sensing</span>
                  </div>
                  <div>
                    <h4 class="headings">{{ `${data.internal}%` }}</h4>
                    <span style="font-size: 10px">Internal Forecast</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 class="tw-font-bold tw-text-right" style="font-size: 15px">ML Model Accuracy</h4>
                <GChart type="PieChart"
                        :data="[
                                ['Effort', 'Percentage'],
                                ['single', data.modelAccuracy.current],
                                ['', 100-data.modelAccuracy.current]
                              ]"
                        :options="{
                          pieHole: 0.6,
                          pieSliceTextStyle: {
                            color: '#8C8C8C',
                            fontSize: '15px'
                          },
                          legend: 'none',
                          slices: {
                            0: {color: '#8C8C8C', textStyle: {color: 'transparent'}},
                            1: {color: '#E6E6E6', textStyle: {color: 'transparent'}}
                          },
                          chartArea: {
                            width: '100px',
                            height: '75px'
                          }}"/>
              </div>
            </div>
            <div class="tw-grid tw-grid-cols-2">
              <div>
                <v-btn v-if="data.variance <= -20 || data.variance >= 20" prepend-icon="mdi-alert-circle" variant="outlined" :color="colorBtnFunc(data.variance)" rounded="pill" class="mt-3">
                  Review<v-icon end icon="mdi-chevron-right"></v-icon>
                </v-btn>
                <v-btn v-else-if="data.variance >= -5 || data.variance <= 5" prepend-icon="mdi-circle" variant="outlined" :color="colorBtnFunc(data.variance)" rounded="pill" class="mt-3">
                  No Action
                  <v-icon end icon="mdi-chevron-right"></v-icon>
                </v-btn>
                <v-btn v-else-if="-20 <= data.variance >= -6 || 6 <= data.variance <= 20" prepend-icon="mdi-circle" variant="outlined" :color="colorBtnFunc(data.variance)" rounded="pill" class="mt-3">
                  Watch List
                  <v-icon end icon="mdi-chevron-right"></v-icon>
                </v-btn>
              </div>
            </div>
          </v-container>
        </v-card>
      </div>
  </div>

  <h3 class="tw-p-2 tw-mt-4 tw-mb-4 tw-font-bold" style="font-style: normal;
font-weight: 500;
font-size: 24px;
line-height: 32px;" v-if="chartDataLoaded">More details for {{projectionMonth}} </h3>
  <v-divider class="tw-mt-2 tw-mb-3"/>
    <div class="tw-mt-4 tw-w-full tw-border-t tw-border-solid tw-border-brand-gray-2" v-if="chartDataLoaded">
      <div class="tw-grid tw-grid-cols-4 tw-gap-3">
        <div class="tw-col-span-1">
          <v-card class="tw-shadow-none">
            <h1 class="tw-font-bold">Key Demand Drivers</h1>
            <GChart
              type="BarChart"
              :data="barChartData"
              :options="barChartOptions"
            />
          </v-card>
        </div>
        <div class="tw-col-span-1">
          <v-card class="tw-shadow-none">
            <h1 class="tw-font-bold">Implied Market Share</h1>
            <GChart
              type="ColumnChart"
              :data="impliedMarketChartData"
              :options="impliedMarketChartOptions"
            />
          </v-card>
        </div>
        <div class="tw-col-span-2">
          <v-card class="tw-shadow-none">
            <h1 class="tw-font-bold">Historic vs Actuals (%YoY)</h1>
            <GChart
              type="ColumnChart"
              :data="columnChartData"
              :options="columnChartOptions"

            />
          </v-card>
        </div>

      </div>
    </div>
</template>
<style scoped>
.projectedPeriod {
  font-style: normal;
  font-weight: 400;
  font-size: 15px;
  line-height: 20px;
  color: #9291A5;
}
.periodDates {
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 27px;
  /* identical to box height */

  display: flex;
  align-items: center;

  /* Neutral Colors/Black */

  color: #1E1B39;
}

.monthsLag {
font-style: normal;
  font-weight: 400;
  font-size: 13px;
  line-height: 14px;
  /* identical to box height, or 93% */


  color: #000000;


  /* Inside auto layout */

  flex: none;
  order: 0;
  flex-grow: 0;
}

.varianceText {
  font-style: normal;
  font-weight: 600;
  font-size: 40px;
  line-height: 48px;
}

.headings {
  font-family: 'Graphik';
  font-style: normal;
  font-weight: 600;
  font-size: 20px;
  line-height: 27px;
}
</style>
