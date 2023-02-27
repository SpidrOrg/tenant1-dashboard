<script>
import { GChart }  from 'vue-google-charts'
import fetchMainDashboardOptions from "@/api/fetchMainDashboardOptions";
import fetchMainDashboardData from "@/api/fetchMainDashboardData";
import TheHeader from './TheHeader.vue'
import _ from 'lodash';
export default {
  name: "DemandPlanner",
  components: {
    GChart,
    TheHeader
  },
  data(){
    return{
      apiData:[],
      filters: {
        categories: [],
        customers: [],
        isByVolume: false
      },
      chartDataLoaded:false,
      projectionMonth:'',
      lag: '',
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
      activeCard: null,
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
    }
  },
  computed: {
    cardsVisibility () {
      return [this.first_quarter, this.second_quarter, this.third_quarter, this.fourth_quarter]
    },
    filteredData () {
      return this.apiData.filter((_, index) => this.cardsVisibility[index])
    }
  },
  async created(){
    await fetchMainDashboardOptions();
   this.apiData = await fetchMainDashboardData();
   console.log(this.apiData);
   this.chartDataLoaded = true;
   this.setActiveCard(0)
  },
  methods:{
    setActiveCard(index) {
      this.activeCard = index;
      let currentCard = _.get(this.filteredData[index], `externalKPIs`);
      let currentCardPy = _.get(this.filteredData[index], `impliedMarketShare`);
      let currentCardHistorical = _.get(this.filteredData[index], `historical`);
      let historicalIdentifiers = currentCardHistorical.identifiers;
      this.projectionMonth = _.get(this.filteredData[index], `period`);
      this.lag = _.get(this.filteredData[index], `lag`);
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
    colorBtnFunc(n) {
      if(Math.abs(n) >= 20) {
        return '#DC3545';
      }
      if(Math.abs(n) >= 6) {
        return '#FF9900';
      }
      return '#04BB46';
    },
    isCheckboxDisabled (isChecked) {
      return isChecked && this.cardsVisibility.filter(isCardVisible => isCardVisible).length === 1
    },
    updateFilters ({name, value}) {
      this.filters = {
        ...this.filters,
        [name]: value
      }
      console.log(this.filters)
    }
  },
};
</script>

<template>
  <v-progress-circular indeterminate color="#7823DC" v-if="!chartDataLoaded" :size="70" :width="7" style="position: fixed;
    left: 50%;
    top: 35%;
  z-index: 1000;"/>
  <div class="tw-flex tw-w-full tw-h-8 tw-bg-brand-gray-1">
    <div class="tw-flex tw-h-full tw-items-center tw-font-bold tw-text-lg">
      Demand Planner Dashboard as of Feb 2023
    </div>
    <div class="tw-ml-auto tw-h-full tw-flex tw-items-center">
      Last refreshed on 01 Jan 2023
    </div>
  </div>
  <div class="tw-flex tw-w-full tw-flex-auto tw-border-t tw-border-solid tw-border-brand-gray-2" />
  <div class="tw-py-5 tw-bg-brand-gray-1" v-if="chartDataLoaded">
    <TheHeader
      :categories="filters.categories"
      :customers="filters.customers"
      :isByVolume="filters.isByVolume"
      @update-filters="updateFilters"
    />
  </div>
  <div class="tw-px-4">
  <div class="tw-flex tw-w-full tw-items-center tw-border-b tw-border-solid tw-border-brand-gray-2" v-if="chartDataLoaded">
    <div class="tw-flex tw-justify-center tw-items-center tw-w-full">
      <p>Show Projections for:</p>
      <div class="tw-flex tw-items-center">
        <v-checkbox
          id="first_quarter"
          color="#7823DC"
          hide-details
          v-model="first_quarter"
          :disabled="isCheckboxDisabled(first_quarter)"
        />
        <label for="first_quarter">Month1-Month3</label>
      </div>
      <div class="tw-flex tw-items-center">
        <v-checkbox
          id="second_quarter"
          color="#7823DC"
          hide-details
          v-model="second_quarter"
          :disabled="isCheckboxDisabled(second_quarter)"
        />
        <label for="second_quarter">Month4-Month6</label>
      </div>
      <div class="tw-flex tw-items-center">
        <v-checkbox
          id="third_quarter"
          color="#7823DC"
          hide-details
          v-model="third_quarter"
          :disabled="isCheckboxDisabled(third_quarter)"
        />
        <label for="third_quarter">Month7-Month9</label>
      </div>
      <div class="tw-flex tw-items-center">
        <v-checkbox
          id="fourth_quarter"
          color="#7823DC"
          hide-details
          v-model="fourth_quarter"
          :disabled="isCheckboxDisabled(fourth_quarter)"
        />
        <label for="fourth_quarter">Month10-Month12</label>
      </div>
    </div>
    <div class="tw-flex tw--ml-40">
      <button class="tw-px-3 tw-py-1.5" style="background: #7823DC">
        <p class="tw-text-white tw-text-sm">Switch to Fixed View</p>
      </button>
    </div>
  </div>
    <div class="tw-flex tw-justify-center tw-gap-2.5 tw-w-full tw-py-5" v-if="chartDataLoaded && filteredData.length">
        <v-card v-for="(data, index) in filteredData" :key="data.period"
                @click="setActiveCard(index)"
                class="tw-w-1/4 tw-shadow-none"
                :style="(activeCard === index) ? 'border:1px solid #7823DC': '' "
        >
          <div class="tw-w-full tw-p-4">
            <div class="tw-flex tw-flex-col tw-pb-2">
                <p style="color: #9291A5;">Projected Period</p>
                <div class="tw-flex tw-gap-x-4 tw-items-center tw-w-full">
                  <p class="tw-text-xl tw-font-medium">{{ data.period }}</p>
                  <div class="tw-bg-brand-gray-4 tw-rounded">
                    <p class="tw-p-1 tw-text-sm">{{ data.lag }} Month Lag</p>
                  </div>
                </div>
            </div>
            <div class="tw-w-full tw-border-t tw-border-solid tw-border-brand-gray-2" v-if="chartDataLoaded"/>
            <div class="tw-grid tw-grid-cols-2 tw-pt-2">
              <div>
                <p class="tw-font-medium tw-text-base tw-pb-1">Projected Growth (%YoY)</p>
                <div class="tw-flex tw-flex-col tw-pb-3">
                  <span class="tw-text-4xl tw-font-semibold" :style="{'color': colorBtnFunc(data.variance)}">{{ `${data.variance}%` }}</span>
                  <span class="tw-text-sm">Variance</span>
                </div>
                <div class="tw-w-full tw-border-t tw-border-solid tw-border-brand-gray-2" v-if="chartDataLoaded"/>
                <div class="tw-grid tw-grid-cols-2 tw-pt-3">
                  <div>
                    <p class="tw-text-2xl tw-font-semibold">{{ `${data.marketSensing}%` }}</p>
                    <span class="tw-text-sm">Market Sensing</span>
                  </div>
                  <div>
                    <p class="tw-text-2xl tw-font-semibold">{{ `${data.internal}%` }}</p>
                    <span class="tw-text-sm">Internal Forecast</span>
                  </div>
                </div>
              </div>
              <div class="tw-flex tw-flex-col tw-items-center">
                <p class="tw-flex tw-font-medium tw-mb-10">ML Model Accuracy</p>
                <div class="tw-relative tw-flex tw-items-center tw-w-32 tw-h-32">
                  <div class="tw-absolute tw-z-10 tw-h-full tw-w-full tw-flex tw-items-center tw-justify-center tw-font-bold">{{Math.round(data.modelAccuracy.current, 0)}}%</div>
                  <GChart type="PieChart"
                          :data="[
                                ['Effort', 'Percentage'],
                                ['single', data.modelAccuracy.current],
                                ['', 100-data.modelAccuracy.current]
                              ]"
                          :options="{
                          pieHole: 0.7,
                          pieSliceTextStyle: {
                            color: 'black',
                            fontSize: '20px'
                          },
                          theme: 'maximized',
                          legend: 'none',
                          slices: {
                            0: {color: '#8C8C8C', textStyle: {color: 'transparent'}},
                            1: {color: '#E6E6E6', textStyle: {color: 'transparent'}}
                          },
                          height: 119,
                          width:119
                          }"/>
                </div>
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
          </div>
        </v-card>
      </div>
    <div class="tw-py-5">
      <div class="tw-flex tw-gap-x-4 tw-items-center tw-w-full tw-pt-4 tw-pb-2" v-if="chartDataLoaded">
        <p class="tw-font-medium tw-text-2xl">More details for {{projectionMonth}}</p>
        <div class="tw-bg-brand-gray-4 tw-rounded">
          <p class="tw-p-1 tw-text-sm">{{lag}} Month Lag</p>
        </div>
      </div>
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
    </div>
  </div>
</template>
