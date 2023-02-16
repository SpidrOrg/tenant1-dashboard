<script>
import { GChart }  from 'vue-google-charts'
import fetchMainDashboardData from "@/api/fetchMainDashboardData";
import TheHeader from './TheHeader.vue'
import {data} from "autoprefixer";
import _ from 'lodash';
export default {
  name: "DemandPlanner",
  components: {
    GChart,
    TheHeader
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
        vAxis: {
          viewWindow: {
            max: 40,
            min: 0,
          },
        },
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
      if(Math.abs(n) >= 20) {
        return '#FF3429B2';
      }
      if(Math.abs(n) >= 6) {
        return '#FFC107B2';
      }
      return '#04BB46';
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
  <div class="tw-flex tw-w-full tw-flex-auto tw-border-t tw-border-solid tw-border-brand-gray-2" />
  <div class="tw-py-5 tw-bg-brand-gray-1" v-if="chartDataLoaded">
    <TheHeader />
  </div>
  <div class="tw-flex tw-w-full tw-items-center tw-justify-end tw-border-b tw-border-solid tw-border-brand-gray-2" v-if="chartDataLoaded">
    <p>Show Projections for:</p>
    <div class="tw-flex">
        <v-checkbox
          label="1-3 months (Default)"
          color="#7823DC"
          hide-details
          v-model="first_quarter"
          :disabled=true
        ></v-checkbox>
        <v-checkbox
          label="4-6 months"
          color="#7823DC"
          hide-details
          v-model="second_quarter"
        ></v-checkbox>
        <v-checkbox
          label="6-9 months"
          color="#7823DC"
          hide-details
          v-model="third_quarter"
        ></v-checkbox>
        <v-checkbox
          label="10-12 months"
          color="#7823DC"
          hide-details
          v-model="fourth_quarter"
        ></v-checkbox>
    </div>
    <div class="tw-flex tw-pl-24 tw-pr-4">
      <v-btn
        :rounded="0"
        color="#7823DC"
      >
        Switch to Fixed View
      </v-btn>
    </div>
  </div>
  <div class="tw-flex tw-w-full tw-flex-auto tw-py-5" v-if="chartDataLoaded">
      <div class="tw-grid tw-grid-cols-4 tw-gap-2.5 tw-m-2" v-if="chartDataLoaded && apiData.length">
        <v-card v-for="(data, index) in apiData" :key="data.period" @click="activeEl(index)" :style="(activeCard == index) ? 'border:1px solid #7823DC': '' ">
          <v-container>
            <div class="tw-flex tw-flex-col tw-pb-2">
                <p style="color: #9291A5;">Projected Period</p>
                <div class="tw-flex tw-gap-x-4 tw-items-center tw-w-full">
                  <p class="tw-text-xl tw-font-medium">{{ data.period }}</p>
                  <div class="tw-bg-brand-gray-4 tw-rounded">
                    <p class="tw-p-1">{{ data.lag }} Months Lag</p>
                  </div>
                </div>
            </div>
            <div class="tw-w-full tw-border-t tw-border-solid tw-border-brand-gray-2" v-if="chartDataLoaded"/>
            <div class="tw-grid tw-grid-cols-2 tw-pt-2">
              <div>
                <h4 class="tw-font-bold tw-text-sm">Projected Growth (%YoY)</h4>
                <h2 class="tw-text-4xl tw-font-semibold" :style="{'color': colorBtnFunc(data.variance)}">{{ `${data.variance}%` }}</h2>
                <span class="tw-text-l">Variance</span>
                <div class="tw-w-full tw-border-t tw-border-solid tw-border-brand-gray-2" v-if="chartDataLoaded"/>
                <div class="tw-grid tw-grid-cols-2 tw-mt-3">
                  <div>
                    <p class="tw-text-2xl tw-font-semibold">{{ `${data.marketSensing}%` }}</p>
                    <span class="tw-text-xs">Market Sensing</span>
                  </div>
                  <div>
                    <p class="tw-text-2xl tw-font-semibold">{{ `${data.internal}%` }}</p>
                    <span class="tw-text-xs">Internal Forecast</span>
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
  <h3 class="tw-pt-4 tw-pb-2 tw-font-medium tw-text-2xl" v-if="chartDataLoaded">More details for {{projectionMonth}} </h3>
  <div class="tw-py-4 tw-w-full tw-border-t tw-border-solid tw-border-brand-gray-2" v-if="chartDataLoaded">
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
