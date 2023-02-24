<script>
import fetchMainDashboardData from "@/api/fetchMainDashboardData";
import TheHeader from './TheHeader.vue'
import CardsList from "./CardsList.vue";
import TheCharts from "./TheCharts.vue";
import _ from 'lodash';

export default {
  name: "DemandPlanner",
  components: {
    TheHeader,
    CardsList,
    TheCharts
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
      impliedMarketChartData:[],
      barChartData:[],
      columnChartData:[],
      activeCard: null,
      periods: {
        first: true,
        second: false,
        third: false,
        fourth: false
      },
    }
  },
  computed: {
    cardsVisibility () {
      return [this.periods.first, this.periods.second, this.periods.third, this.periods.fourth]
    },
    filteredData () {
      return this.apiData.filter((_, index) => this.cardsVisibility[index])
    },
    chartsData () {
      return ({
        impliedMarketChartData : this.impliedMarketChartData,
        barChartData: this.barChartData,
        columnChartData: this.columnChartData,
      })
    },
    checkboxLabels () {
      return this.apiData.map(el => el.period)
    }
  },
  async created(){
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
        ["Disposable income", currentCard['Per-capita disposable income']],
        ['Pandemic', currentCard['Pandemic']],
        ['Consumer behaviour', currentCard['Consumer behaviour']],
        ['Loans consumption', currentCard['Loans consumption']]
      ]
      this.impliedMarketChartData = [
        ['', 'PyActual', 'Implied'],
        [this.projectionMonth, currentCardPy['pyActual'], currentCardPy['implied']],
      ]
      this.columnChartData = [];
      this.columnChartData.push(historicalIdentifiers);
      let v= this;
      _.forEach(currentCardHistorical.data, function(data){
        v.columnChartData.push(data);
      })
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
  <div class="tw-h-full tw-w-full tw-bg-brand-gray-1">
    <div class="tw-flex tw-w-full tw-h-8 tw-bg-brand-gray-1">
      <div class="tw-flex tw-h-full tw-items-center tw-font-bold tw-text-lg">
        Demand Planner Dashboard as of Feb 2023
      </div>
      <div class="tw-ml-auto tw-h-full tw-flex tw-items-center">
        Last refreshed on 01 Jan 2023
      </div>
    </div>
    <div class="tw-flex tw-w-full tw-flex-auto tw-border-t tw-border-solid tw-border-brand-gray-2" />
    <div class="tw-w-full tw-h-3/4 tw-flex tw-justify-center tw-items-center" v-if="!chartDataLoaded">
      <v-progress-circular indeterminate color="#7823DC" :size="80" :width="10" />
    </div>
    <div class="tw-py-5" v-if="chartDataLoaded">
        <TheHeader
          :categories="filters.categories"
          :customers="filters.customers"
          :isByVolume="filters.isByVolume"
          @update-filters="updateFilters"
        />
      </div>
    <div class="tw-w-full tw-p-4 tw-bg-white" v-if="chartDataLoaded">
        <div class="tw-flex tw-flex-col tw-w-full tw-border-b tw-border-solid tw-border-brand-gray-2">
          <h1 class="tw-text-3xl tw-font-bold">Future Demand Forecasting</h1>
          <div class="tw-flex tw-items-center tw-w-full">
            <p>Show demand projections for:</p>
            <div class="tw-flex tw-items-center">
              <v-checkbox
                id="period_first"
                color="#7823DC"
                hide-details
                v-model="periods.first"
                :disabled="isCheckboxDisabled(periods.first)"
              />
              <label for="period_first">{{checkboxLabels[0]}}</label>
            </div>
            <div class="tw-flex tw-items-center">
              <v-checkbox
                id="period_second"
                color="#7823DC"
                hide-details
                v-model="periods.second"
                :disabled="isCheckboxDisabled(periods.second)"
              />
              <label for="period_second">{{checkboxLabels[1]}}</label>
            </div>
            <div class="tw-flex tw-items-center">
              <v-checkbox
                id="period_third"
                color="#7823DC"
                hide-details
                v-model="periods.third"
                :disabled="isCheckboxDisabled(periods.third)"
              />
              <label for="period_third">{{checkboxLabels[2]}}</label>
            </div>
            <div class="tw-flex tw-items-center">
              <v-checkbox
                id="period_fourth"
                color="#7823DC"
                hide-details
                v-model="periods.fourth"
                :disabled="isCheckboxDisabled(periods.fourth)"
              />
              <label for="period_fourth">{{checkboxLabels[3]}}</label>
            </div>
            <div class="tw-flex tw-ml-auto">
              <button class="tw-px-3 tw-py-1.5" style="background: #7823DC">
                <p class="tw-text-white tw-text-sm">Switch to Fixed/Quarterly View</p>
              </button>
            </div>
          </div>
        </div>
        <div class="tw-flex tw-justify-center tw-gap-2.5 tw-w-full tw-py-5" v-if="filteredData.length">
          <CardsList :data="filteredData" :activeCard="activeCard" @setActiveCard="setActiveCard"/>
        </div>
        <div class="tw-p-4" style="border: 1px solid #7823DC;">
          <div class="tw-flex tw-gap-x-4 tw-items-center tw-w-full tw-py-2">
            <p class="tw-font-medium tw-text-2xl">More details for {{projectionMonth}}</p>
            <div class="tw-bg-brand-gray-4 tw-rounded">
              <p class="tw-p-1 tw-text-sm">Future {{ lag }} months</p>
            </div>
          </div>
          <div class="tw-py-3 tw-w-full" v-if="chartDataLoaded && chartsData">
            <TheCharts :data="chartsData" />
          </div>
        </div>
      </div>
  </div>
</template>
