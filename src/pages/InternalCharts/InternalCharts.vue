<script>
import { GChart }  from 'vue-google-charts'
import TheHeader, {ALL_OPTION} from './TheHeader'
import fetchInternalChartsData from "@/api/fetchInternalChartsData";
import _ from "lodash";

export default {
  name: "InternalCharts",
  components:{
    GChart,
    TheHeader
  },
  data(){
    return {
      isLoading:false,
      apiData:[],
      columnChartData:[],
      debounceUpdateFilters: _.debounce(this.updateFilters, 3000),
      columnChartOptions:{
        height:370,
        legend: {position: 'top'},
        colors: ['#787878', '#B991EB'],
        hAxis : {
          textStyle : {
            fontSize: 10
          }
        },
        chartArea:{
          left: '3%',
          width:'90%'
        },
        // vAxis: {
        //   baselineColor: 'none',
        //   textPosition: 'none'
        // }
      },
      lineChartData:[],
      lineChartOptions:{
        curveType: 'none',
        legend: { position: 'top' },
        colors: ['#570EAA', '#787878', '#C8A5F0'],
        height:370,
        series: {
          1: {lineDashStyle: [4, 4]}
        },
        hAxis : {
          textStyle : {
            fontSize: 10
          }
        },
        // vAxis: {
        //   baselineColor: 'none',
        //   textPosition: 'none'
        // },
        chartArea:{
          left: '3%',
          width:'90%'
        },
      }
    }
  },

  async created() {
    this.isLoading = true;
    try {
      this.apiData = await fetchInternalChartsData();
      this.columnChartData.push(this.apiData[0].internal_forecast.identifiers);
      this.lineChartData.push(this.apiData[0].projections.identifiers);
      let v = this;
      _.forEach(this.apiData[0].internal_forecast.data, function (data) {
        v.columnChartData.push(data);
      });
      _.forEach(this.apiData[0].projections.data, function (data) {
        v.lineChartData.push(data);
      });
    } catch (e) {
      this.error = e;
    }
    this.isLoading = false;
  },
  methods:{
    async updateFilters(filtersData){
      this.dataLoading = true;
      const selectedCategories = _.get(filtersData, "categories.selected");
      const selectedCustomers = _.get(filtersData, "customers.selected");
      const selectedValueORvolume = _.get(filtersData, "valueOrQuantity");

      const response = await fetchInternalChartsData({
        categories: selectedCategories === ALL_OPTION ? "*" : selectedCategories,
        customers: selectedCustomers === ALL_OPTION ? "*" : selectedCustomers,
        valueORvolume: selectedValueORvolume
      });

      if (!_.isEmpty(response)){
        this.dataLoading = false;
        this.dashboardData.periodsData = response;
        _.forEach(this.dashboardData.periodsData, (v, i) => {
          v.label = _.get(_.keys(v), "[0]");
          v.metrics = _.get(v, `${v.label}.metrics`, {})
          v.lag = _.get(v, `${v.label}.futureLagMonths`, "");
          v.modelAccuracy = _.get(v, `${v.label}.modelAccuracy`, null);
          delete v[v.label];

          v.metrics.variance = _.round(_.subtract(v.metrics.jdaGrowth, v.metrics.marketSensingGrowth), 0)
          v.isChecked = i === 0;
          v.isActive = i === 0;

        })
      }
    }
  }
}
</script>

<template>
  <v-progress-circular indeterminate color="#7823DC" v-if="isLoading" :size="70" :width="7" style="position: fixed;
    left: 50%;
    top: 35%;
  z-index: 1000;"/>
  <div class="tw-w-full tw-h-full tw-bg-brand-gray-1">
    <div class="tw-flex tw-h-8 tw-items-center tw-font-bold">
      Internal Charts
    </div>
    <div class="tw-flex tw-w-full tw-flex-auto tw-border-t tw-border-solid tw-border-brand-gray-2" />
    <div class="tw-py-5 tw-bg-brand-gray-1" v-if="!isLoading">
      <TheHeader />
    </div>
    <div class="tw-w-full tw-border-t tw-border-solid tw-border-brand-gray-2" v-if="!isLoading">
      <div class="tw-grid tw-grid-rows-2 tw-gap-6">
        <div>
          <v-card style="height: 370px">
            <h3 class="tw-font-bold  tw-py-2 tw-pl-2">Internal Forecast vs Actuals</h3>
            <div class="tw-w-full tw-items-left tw-border-t tw-border-solid tw-border-brand-gray-2" />
            <GChart type="ColumnChart" :data="columnChartData" :options="columnChartOptions" height="370"/>
          </v-card>
        </div>
        <div>
          <v-card style="height: 370px">
            <h3 class="tw-font-bold tw-py-2 tw-pl-2">Projections of MS vs Internal vs Actuals</h3>
            <div class="tw-flex tw-w-full tw-flex-auto tw-border-t tw-border-solid tw-border-brand-gray-2" />
            <GChart type="LineChart" :options="lineChartOptions" :data="lineChartData"/>
          </v-card>
        </div>
      </div>
    </div>
  </div>
  <v-divider/>
<!--  <div class="tw-w-full tw-h-8 tw-bg-brand-gray-1">-->
<!--    <div class="tw-w-full tw-border-t tw-border-solid tw-border-brand-gray-2" v-if="chartDataLoaded">-->
<!--      <div class="tw-align-center tw-grid tw-grid-cols-1">-->
<!--        <div>-->
<!--          <GChart type="LineChart" :options="lineChartOptions" :data="lineChartData"/>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->
<!--  </div>-->
</template>
