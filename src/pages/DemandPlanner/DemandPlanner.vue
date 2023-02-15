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
      }
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
    }
  }
};


</script>

<template>
  <div class="tw-flex tw-w-full tw-h-8 tw-bg-brand-gray-1">
    <div class="tw-flex tw-h-full tw-items-center tw-font-bold">
      Demand Planner Dashboard as of Jan 2023
    </div>
    <div class="tw-ml-auto tw-h-full tw-flex tw-items-center">
      Last Refreshed
    </div>
  </div>
  <div class="tw-flex tw-w-full tw-flex-auto tw-border-t tw-border-solid tw-border-brand-gray-2">
      <div class="tw-grid tw-grid-cols-4 tw-gap-2.5 tw-m-2" v-if="chartDataLoaded && apiData.length">
        <v-card v-for="(data, index) in apiData" :key="data.period" @click="activeEl(index)" :style="(activeCard == index) ? 'border:1px solid #7823DC': '' ">
          <div class="tw-grid tw-grid-cols-2">
            <div>
              <p style="font-family: 'Graphik';
font-style: normal;
font-weight: 400;
font-size: 15px;
line-height: 20px;
color: #9291A5;">Projected Period</p>
              <h3 style="font-family: 'Graphik';
font-style: normal;
font-weight: 500;
font-size: 16px;
line-height: 27px;
/* identical to box height */

display: flex;
align-items: center;

/* Neutral Colors/Black */

color: #1E1B39;">{{ data.period }}</h3>
            </div>
            <div style="display: flex;
flex-direction: row;
justify-content: center;
align-items: center;
padding: 5px;
background: #EDEDED;
border-radius: 4px;">
              <span style="font-family: 'Graphik';
font-style: normal;
font-weight: 400;
font-size: 13px;
line-height: 14px;
/* identical to box height, or 93% */


color: #000000;


/* Inside auto layout */

flex: none;
order: 0;
flex-grow: 0;">{{ data.lag }} Months Lag</span>
            </div>
            <v-divider/>
          </div>
          <div class="tw-grid tw-grid-cols-2">
            <div>
              <h4 style="font-family: 'Graphik';
font-style: normal;
font-weight: 500;
font-size: 14px;
line-height: 18px;
/* identical to box height, or 129% */


color: #1E1E1E;">Projected Growth (%YoY)</h4>
              <h2 style="font-family: 'Graphik';
font-style: normal;
font-weight: 600;
font-size: 36px;
line-height: 48px;

color: #FF9900;">{{ `${data.variance}%` }}</h2>
              <span style="font-size: 10px">variance</span>
              <v-divider/>
              <div class="tw-grid tw-grid-cols-2">
                <div>
                  <h4 style="font-family: 'Graphik';
font-style: normal;
font-weight: 600;
font-size: 20px;
line-height: 27px;">{{ `${data.marketSensing}%` }}</h4>
                  <span style="font-size: 10px">Market Sensing</span>
                </div>
                <div>
                  <h4 style="font-family: 'Graphik';
font-style: normal;
font-weight: 600;
font-size: 20px;
line-height: 27px;">{{ `${data.internal}%` }}</h4>
                  <span style="font-size: 10px">Internal Forecast</span>
                </div>
              </div>
            </div>
            <div>
              <h4 style="font-family: 'Graphik';
font-style: normal;
font-weight: 500;
font-size: 14px;
line-height: 18px;
/* identical to box height, or 129% */


color: #1E1E1E;">ML Model Accuracy</h4>
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
        </v-card>
      </div>
  </div>
  <h3 class="mt-4 mb-4">More details for {{projectionMonth}} </h3>
  <v-divider class="tw-mt-2 tw-mb-3"/>
    <div class="tw-flex tw-w-full tw-flex-auto tw-border-t tw-border-solid tw-border-brand-gray-2">
      <div class="tw-grid tw-grid-cols-5 tw-gap-2.5">
        <v-card>
          <GChart
            type="BarChart"
            :data="barChartData"
            :options="barChartOptions"
          />
        </v-card>
        <v-card>
          <GChart
            type="ColumnChart"
            :data="impliedMarketChartData"
            :options="impliedMarketChartOptions"
          />
        </v-card>
        <v-card>
          <GChart
            type="ColumnChart"
            :data="columnChartData"
            :options="columnChartOptions"
          />
        </v-card>
      </div>
    </div>
</template>
