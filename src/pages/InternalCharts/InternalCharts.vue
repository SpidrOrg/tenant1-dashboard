<script>
import { GChart }  from 'vue-google-charts'
import TheHeader, {ALL_OPTION} from './TheHeader'
import fetchInternalChartsData from "@/api/fetchInternalChartsData";
import { format as formatFn } from 'date-fns';
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
      refreshDate:null,
      apiData:[],
      columnChartData:[],
      debounceUpdateFilters: _.debounce(this.updateFilters, 500),
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

   //created() {
     //this.isLoading = true;
  //   //try {
  //     const selectedCategories = _.get(filtersData, "categories.selected");
  //     const selectedCustomers = _.get(filtersData, "customers.selected");
  //     const selectedValueORvolume = _.get(filtersData, "valueOrQuantity");
  //     this.apiData = await fetchInternalChartsData({categories: selectedCategories === ALL_OPTION ? "*" : selectedCategories,
  //       customers: selectedCustomers === ALL_OPTION ? "*" : selectedCustomers,
  //       valueORvolume: selectedValueORvolume});
  //     this.columnChartData.push(this.apiData[0].internal_forecast.identifiers);
  //     this.lineChartData.push(this.apiData[0].projections.identifiers);
  //     let v = this;
  //     _.forEach(this.apiData[0].internal_forecast.data, function (data) {
  //       v.columnChartData.push(data);
  //     });
  //     _.forEach(this.apiData[0].projections.data, function (data) {
  //       v.lineChartData.push(data);
  //     });
  //   // } catch (e) {
  //   //   this.error = e;
  //   // }
  //   this.isLoading = false;
   //},
  methods:{
    async updateFilters(filtersData){
      try{
          //this.refreshDate = formatFn(new Date(refreshDate));
          this.isLoading = true;
          const selectedCategories = _.get(filtersData, "categories.selected");
          const selectedCustomers = _.get(filtersData, "customers.selected");
          const selectedValueORvolume = _.get(filtersData, "valueOrQuantity");
          const selectedTimeHorizon = _.get(filtersData, "time_horizon.selected");
          const selectedInternalModel = _.get(filtersData, "internal_model.selected");
          const refreshDate = _.get(filtersData, "refreshDate");
          this.refreshDate = formatFn(new Date(_.get(filtersData, "refreshDate")),'MMM dd,yyyy');

          const response = await fetchInternalChartsData({categories: selectedCategories === ALL_OPTION ? "*" : selectedCategories,
            customers: selectedCustomers === ALL_OPTION ? "*" : selectedCustomers,
            valueORvolume: selectedValueORvolume,msTimeHorizon:selectedTimeHorizon,internalModel:selectedInternalModel, refreshDate:refreshDate});
            if (!_.isEmpty(response)){
              this.apiData = response;
              this.isLoading = false;
              let v = this;
              if(!this.columnChartData.length){
                
                this.columnChartData.push(['period','Internal','Actual']);
                _.forEach(this.apiData, function (data) {
                v.columnChartData.push([data.timeline,data.forecastSales,data.actualSales]);
              });
              }
              if(!this.lineChartData.length){
                this.lineChartData.push(['period','Market Sensing Forecast','Internal Forecast','Sales']);
                _.forEach(this.apiData, function (data) {
                v.lineChartData.push([data.timeline,data.msProjectedGrowth,data.forecastGrowth,data.actualGrowth]);
              });
              }
        }       
      } catch(e) {
        console.log(e);
      }
      this.isLoading = false;
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
    <div class="tw-flex tw-w-full tw-h-8 tw-bg-brand-gray-1">
      <div class="tw-flex tw-h-full tw-items-center tw-font-bold tw-text-lg">
      Internal Charts
    </div>
    <div class="tw-ml-auto tw-h-full tw-flex tw-items-center">
      Last refreshed on {{refreshDate}}
    </div>
    </div>
    <div class="tw-flex tw-w-full tw-flex-auto tw-border-t tw-border-solid tw-border-brand-gray-2" />
    <div class="tw-py-5 tw-bg-brand-gray-1">
      <TheHeader  @update-filters="debounceUpdateFilters"/>
    </div>
    <div class="tw-w-full tw-border-t tw-border-solid tw-border-brand-gray-2" v-if="!isLoading">
      <div class="tw-grid tw-grid-rows-2 tw-gap-6">
        <div>
          <v-card style="height: 370px">
            <h3 class="tw-font-bold  tw-py-2 tw-pl-2">Internal Forecast vs Sales</h3>
            <div class="tw-w-full tw-items-left tw-border-t tw-border-solid tw-border-brand-gray-2" />
            <GChart type="ColumnChart" :data="columnChartData" :options="columnChartOptions" height="370"/>
          </v-card>
        </div>
        <div>
          <v-card style="height: 370px">
            <h3 class="tw-font-bold tw-py-2 tw-pl-2">Projections of Market Sensing Forecast vs Internal Forecast vs Sales</h3>
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
