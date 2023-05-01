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
      isLoading:true,
      refreshDate:null,
      apiData:[],
      columnChartData:[],
      debounceUpdateFilters: _.debounce(this.updateFilters, 4500),
      filterDisabled:false,
      columnChartOptions:{
        height:320,
        explorer: {
          axis:'horizontal'
        },
        legend: {position: 'none'},
        tooltip: { trigger: 'none' },
        colors: ['#787878', '#B991EB'],
        hAxis : {
          textStyle : {
            fontSize: 12
          },

        },
        vAxis : {
          minorGridlines:{color:'none'},
          gridlines: {
            count: 0
        },
        textPosition: 'none',
        },
        chartArea:{
          left: '1%',
          width:'100%'
        },
        annotations: {
          textStyle: {
            color: '#000000',
            fontSize: 12,
          },
          datum: { stem: { length: 0 } },
          alwaysOutside: true,
        },
      },
      lineChartData:[],
      lineChartOptions:{
        curveType: 'none',
        explorer: {
          axis:'horizontal'
        },
        tooltip: { trigger: 'none' },
        vAxis : {
          minorGridlines:{color:'none'},
          gridlines: {
            count: 0
        },
        textPosition: 'none',
        },
        annotations: {
          textStyle: {
            color: '#000000',
            fontSize: 12,
          },
          datum: { stem: { length: 0 } },
          alwaysOutside: true,
        },
        legend: { position: 'top',textStyle: {fontSize: 12}},
        colors: ['#570EAA', '#787878', '#C8A5F0'],
        height:370,
        series: {
          1: {lineDashStyle: [4, 4]}
        },
        hAxis : {
          textStyle : {
            fontSize: 12
          }
        },
        chartArea:{
          left: '1%',
          width:'100%'
        },
      }
    }
  },
  methods:{
    async updateFilters(filtersData){
      try{
        this.columnChartData = [];
        this.lineChartData = [];
          this.isLoading = true;
          this.filterDisabled = true;
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
              this.filterDisabled = false;
              let v = this;
              if(!this.columnChartData.length){

                this.columnChartData.push(['period','Internal',{'role':'annotation'},'Actual',{'role':'annotation'}]);
                _.forEach(this.apiData, function (data) {
                v.columnChartData.push([data.timeline,data.forecastSales,data.forecastSales+data.unit,data.actualSales,data.actualSales+data.unit]);
              });
              }
              if(!this.lineChartData.length){
                this.lineChartData.push(['period','Market Sensing Forecast',{'role':'annotation'},'Internal Forecast',{'role':'annotation'},'Sales',{'role':'annotation'}]);
                _.forEach(this.apiData, function (data) {
                v.lineChartData.push([data.timeline,data.msProjectedGrowth,data.msProjectedGrowth+'%',data.forecastGrowth,data.forecastGrowth+'%',data.actualGrowth,data.actualGrowth+'%']);
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
      <TheHeader  @update-filters="debounceUpdateFilters" :filterDisabled="filterDisabled"/>
    </div>
    <div class="tw-w-full tw-border-t tw-border-solid tw-border-brand-gray-2" v-if="!isLoading">
      <div class="tw-grid tw-grid-rows-2 tw-gap-6">
        <div style="overflow-x: auto !important">
          <v-card style="width:3500px;height: 370px;">
            <p class="tw-font-medium tw-text-xl tw-pl-2 tw-pt-2 tw-mb-2">Internal Forecast vs Sales</p>
            <div class="overflow-x-auto tw-w-full tw-items-left tw-border-t tw-border-solid tw-border-brand-gray-2" />
            <div class="tw-flex tw-mt-3">
                <div style="width:12px;height:12px;background: #787878;" class="tw-ml-3 tw-mt-px">
                </div>
                <div style="height:12px;" class="tw-text-xs tw-ml-1">Internal Forecast</div>
                <div class="tw-flex">
                <div style="width:12px;height:12px;background: #b991eb;" class="tw-ml-3 tw-mt-px">
                </div>
                <div style="height:12px;" class="tw-text-xs tw-ml-1">Sales</div>
                </div>
              </div>
            <GChart type="ColumnChart" :data="columnChartData" :options="columnChartOptions" height="370"/>
          </v-card>
        </div>
        <div style="overflow-x: auto !important">
          <v-card style="width:3500px;height: 370px;">
            <p class="tw-font-medium tw-text-xl tw-pl-2 tw-pt-2 tw-mb-2">Projections of Market Sensing Forecast vs Internal Forecast vs Sales</p>
            <div class="tw-flex tw-w-full tw-flex-auto tw-border-t tw-border-solid tw-border-brand-gray-2" />
            <GChart type="LineChart" :options="lineChartOptions" :data="lineChartData"/>
          </v-card>
        </div>
      </div>
    </div>
  </div>
  <v-divider/>
</template>
