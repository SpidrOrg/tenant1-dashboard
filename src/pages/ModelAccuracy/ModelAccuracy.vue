<script>
import { GChart }  from 'vue-google-charts'
import fetchModelAccuracyData from "@/api/fetchModelAccuracyData";
import fetchCVRollingAccuracyData from '@/api/fetchCVRollingAccuracyData';
import _ from "lodash";
import fetchModelAccuracyOptions from "@/api/fetchDashboardOptions";
export const ALL_OPTION = "All";
export default {
  name: "InternalCharts",
  props: {
    pageConfig: {
      type: Object,
      required: false
    },
    uiConfig: {
      type: Object,
      required: false
    },
  },
  components:{
    GChart
  },
  data(){
    return {
      isLoading:true,
      firstTimeLoad:true,
      isCVAccuracyLoading: false,
      isHistoricPerformanceLoading:false,
      cvAccuracy:false,
      accuracy_disabled:false,
      historic_disabled:false,
      ms_refresh_date: null,
      apiData:[],
      filtersTestAccuracy : {
        categories: {
          items: [],
          selected: null,
          filterlabel: "Categories"
        }
      },
      filtersCharts : {
        categories: {
          items: [],
          selected: null,
          filterlabel: "Categories"
        },
        projected_period: {
          items: [],
          selected: null,
          filterlabel: "Projected Period"
        },
      },
      columnChartData:[],
      columnChartOptions:{
        bar: {groupWidth: "50%"},
        height:400,
        tooltip: { trigger: 'none' },
        legend: {position: 'none'},
        colors: ['#A5A5A5', '#5F5F5F'],
        hAxis : {
          textStyle : {
            fontSize: 10
          }
        },
        vAxis : {
          gridlines: {
            count: 0
        },
        textPosition: 'none',
        },
        chartArea:{
          left: '3%',
          width:'90%'
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
        tooltip: { trigger: 'none' },
        legend: { position: 'none' },
        colors: ['#8737E1'],
        height:100,
        series: {
          1: {lineDashStyle: [4, 4]}
        },
        annotations: {
          textStyle: {
            color: '#000000',
            fontSize: 12,
          },
          datum: { stem: { length: 0 } },
          alwaysOutside: true,
        },
        hAxis : {
          baselineColor: 'none',
          textPosition: 'none',
          textStyle : {
            fontSize: 10
          },
          gridlines: {
            color: 'transparent'
          }
        },
        vAxis: {
          baselineColor: 'none',
          textPosition: 'none',
          gridlines: {
            color: 'transparent'
          }
        },
        chartArea:{
          left: '3%',
          width:'90%',
          height:'90%'
        },
      },
      cvAccuracyData:[],
      cvAccuracyOptions:{
        height:410,
        width:650,
        bar: {groupWidth: "50%"},
        colors: ['#570EAA'],
        legend:{
          position:'none'
        },
        annotations: {
          textStyle: {
            color: '#000000',
            fontSize: 12,
          },
          datum: { stem: { length: 2, color:'none' } },
        },
        tooltip: { trigger: 'none' },
        chartArea:{
          left: '3%',
          width:'100%'
        },
        vAxis: {
        gridlines: {
            count: 0
        },
        minValue: 0,
        textPosition: 'none',
      }
      },
      rollingTestAccuracyData:[],
      rollingTestAccuracyOptions:{
        height:380,
        width:650,
        bar: {groupWidth: "50%"},
        legend:{
          position:'none'
        },
        annotations: {
          textStyle: {
            color: 'black',
            fontSize: 13,
          },
          datum: { stem: { length: 2, color:'none' } },
        },
        vAxis: {
          gridlines: {
            count: 0
        },
        textPosition: 'none',
        minValue: 0,
      },
        tooltip: { trigger: 'none' },
        chartArea:{
          left: '3%',
          width:'100%',
        },
      },
      ALL_OPTION,
      includes: _.includes
    }
  },
  methods: {
    getColorCode(n) {
      switch (true) {
        case n >= 90:
          return '#8737E1';
        case n >= 80:
          return '#BF9CEC';
        case n >= 60:
          return '#C6C6C9';
        default:
          return '#A7A7AA';
      }
    },
    selectFilterUpdated : function(filterName, currentSelection){
      this.filtersCharts[filterName].selected = currentSelection;
      this.filtersUpdated();
    },
    selectAccuracyFilterUpdated(filterName, currentSelection){
      this.filtersTestAccuracy[filterName].selected = currentSelection;
      this.filtersAccuracyUpdated();
    },
    filtersUpdated: _.debounce(async function(){
      let v = this;
      this.lineChartData = [];
      this.columnChartData = [];
      //this.cvAccuracyData = [];
      //this.rollingTestAccuracyData = [];
      if(this.firstTimeLoad){
        this.isLoading = true;
        this.isHistoricPerformanceLoading = false;
      } else {
        this.isLoading = false;
        this.isHistoricPerformanceLoading = true;
        this.historic_disabled = true;
      }
      const selectedHistoricCategories = _.get(this.filtersCharts, "categories.selected");
      const selectedprojectedPeriod = _.get(this.filtersCharts, "projected_period.selected");
      const response = await fetchModelAccuracyData({msRefreshDate: this.ms_refresh_date, categoriesHistoric: selectedHistoricCategories === ALL_OPTION ? "*" : selectedHistoricCategories,projected_period: selectedprojectedPeriod});
      if (!_.isEmpty(response)){
        this.apiData = response;

        //Historic Performance data
        if(!this.columnChartData.length){
          this.columnChartData.push(['Period','Predicted Values',{'role':'annotation'}, 'Actual Values',{'role':'annotation'}]);
          _.forEach(this.apiData.historicPredicted, function (data) {
          v.columnChartData.push(data);
          });
        }

      //Historic performance end

     //Historic Performance accuracy data
     if(!this.lineChartData.length){
        this.lineChartData.push(['Time Period','Prediction Accuracy',{role: 'annotation', type: 'string'}]);
        //this.lineChartData.push(this.apiData.accuracyData);
        _.forEach(this.apiData.accuracyData, function (data) {
          v.lineChartData.push([data[0],data[1],data[1]+'%']);
        });
     }

    }
    if(this.firstTimeLoad){
        this.isLoading = false;
        this.isHistoricPerformanceLoading = false;
      } else {
        this.isLoading = false;
        this.isHistoricPerformanceLoading = false;
        this.historic_disabled = false;
      }
      this.firstTimeLoad = false;
    }, 300),
    async filtersAccuracyUpdated(){
      let v = this;
      //this.lineChartData = [];
      //this.columnChartData = [];
      this.cvAccuracyData = [];
      this.rollingTestAccuracyData = [];
      if(this.firstTimeLoad){
        this.isLoading = true;
        this.isCVAccuracyLoading = false;
      } else {
        this.isLoading = false;
        this.isCVAccuracyLoading = true;
        this.accuracy_disabled = true;
      }
      const selectedAccuracyCategories = _.get(this.filtersTestAccuracy, "categories.selected");
      const response = await fetchCVRollingAccuracyData({msRefreshDate: this.ms_refresh_date, categoriesAccuracy: selectedAccuracyCategories === ALL_OPTION ? "*" : selectedAccuracyCategories});
            if (!_.isEmpty(response)){
                  this.apiData = response;


      //Historic Performance accuracy data --end

      //CV Accuracy Data
      if(!this.cvAccuracyData.length){
        this.cvAccuracyData.push(['Period','Predicted Values',{ role: 'annotation' },{ role: 'style' }]);
        _.forEach(this.apiData.cvAccuracyData, function (data) {
          v.cvAccuracyData.push([data['period'],data['value'],data['value']+'%',`color: ${v.getColorCode(data['value'])}`]);
        });

      }
      //CV Accuracy Data --end

        //Rolling Test Accuracy Data
       //Rolling Test Accuracy Data
       if(!this.rollingTestAccuracyData.length){
          this.rollingTestAccuracyData.push(['Period','Predicted Values',{ role: 'annotation' },{ role: 'style' }]);

          _.forEach(this.apiData.rollingAccuracyData, function (data) {
            v.rollingTestAccuracyData.push([data['period'],data['value'],data['value']+'%',`color: ${v.getColorCode(data['value'])}`]);
          });
        }
      }
        //Rolling Test Accuracy Data --end
        //Rolling Test Accuracy Data --end

        if(this.firstTimeLoad){
        this.isLoading = false;
        this.isCVAccuracyLoading = false;
      } else {
        this.isLoading = false;
        this.isCVAccuracyLoading = false;
        this.accuracy_disabled = false;
      }
      this.firstTimeLoad = false
    },
  },
  emits: ['updateFilters'],
  async created() {
    this.isLoading = true;
    this.isCVAccuracyLoading = false;
    this.isHistoricPerformanceLoading = false;

    const filtersApiData = await fetchModelAccuracyOptions().catch(() => null);
    this.ms_refresh_date = _.get(filtersApiData, "updateDates[0]", null);
    const options = _.get(filtersApiData, "ms");
    if (options){
      this.filtersCharts.categories.items = options.categories;
      this.filtersCharts.projected_period.items = options.msTimeHorizon;
      this.filtersTestAccuracy.categories.items = options.categories;
    }
    // Add all option to the categories and customers filters
    // this.filtersCharts.categories.items = this.filtersCharts.categories.items;
    // this.filtersTestAccuracy.categories.items =this.filtersTestAccuracy.categories.items;

    this.selectFilterUpdated("categories", this.filtersCharts.categories.items[0]);
    this.selectAccuracyFilterUpdated("categories", this.filtersTestAccuracy.categories.items[0]);
    this.selectFilterUpdated("projected_period", this.filtersCharts.projected_period.items[0]);
  },
}
</script>

<template>
   <v-progress-circular indeterminate color="#7823DC" v-if="isLoading" :size="70" :width="7" style="position: fixed;
    left: 50%;
    top: 35%;
  z-index: 1000;"/>
  <v-progress-circular indeterminate color="#7823DC"  :size="70" :width="7" style="position: fixed;
    left: 50%;
    top: 35%;
  z-index: 1000;" v-if="isCVAccuracyLoading"/>
  <v-progress-circular indeterminate color="#7823DC"  :size="70" :width="7" style="position: fixed;
    left: 50%;
    top: 70%;
  z-index: 1000;" v-if="isHistoricPerformanceLoading"/>
  <div class="tw-w-full tw-h-full tw-bg-brand-gray-1">
    <div class="tw-flex tw-h-8 tw-items-center tw-font-bold">
      Accuracy
    </div>
    <div class="tw-flex tw-w-full tw-flex-auto tw-border-t tw-border-solid tw-border-brand-gray-2" />
    <div class="tw-w-full tw-border-t tw-border-solid tw-border-brand-gray-2" >
      <div class="tw-grid tw-grid-rows-2">
        <div>
          <v-card>
            <div class="tw-font-bold  tw-py-2 tw-pl-2 tw-text-lg">
              Model Accuracy Forecast Performance
            </div>
            <div class="tw-flex tw-w-full tw-flex-auto tw-border-t tw-border-solid tw-border-brand-gray-2" />
            <div class="tw-flex tw-gap-x-4 tw-w-full tw-bg-white tw-px-3">
              <div class="tw-pt-3 tw-min-w-[14%] tw--mb-3">
                <label for="category" class="tw-text-sm">Category</label>
                <v-select
                  :disabled="accuracy_disabled"
                  :items="filtersTestAccuracy.categories.items"
                  :model-value="filtersTestAccuracy.categories.selected"
                  @update:modelValue="value=>selectAccuracyFilterUpdated('categories', value)"
                  density="comfortable"
                ></v-select>
              </div>
              <div class="tw-flex tw-items-center tw-gap-1.5 tw-mt-3">
                <p :class="`${!cvAccuracy ? 'tw-font-medium desktop:tw-leading-tight small-laptop:tw-leading-tight desktop:tw-text-end small-laptop:tw-text-end' : 'desktop:tw-leading-tight small-laptop:tw-leading-tight desktop:tw-text-end small-laptop:tw-text-end'}`" >Rolling Test Accuracy</p>
                <div class="tw-flex tw-pt-5" style="color: #7823DC;">
                  <v-switch inset @click="cvAccuracy = !cvAccuracy"></v-switch>
                </div>
                <p :class="`${cvAccuracy ? 'tw-font-medium desktop:tw-leading-tight small-laptop:tw-leading-tight' : 'desktop:tw-leading-tight small-laptop:tw-leading-tight'}`">CV Accuracy</p>
            </div>

              <div class="tw-flex tw-justify-end tw-items-center tw-w-7/12 tw-mt-9" style="height:72px">
                <img src="@/images/model-accuracy-scale.svg" class="tw-h-full"/>
              </div>
            </div>
            <div v-if="cvAccuracy" class="tw-block tw-m-auto">
              <div class="tw-flex tw-justify-center">
                <h3 class="tw-pl-2 tw-flex tw-h-8 tw-justify-center tw-font-bold tw-text-lg tw-pt-3">CV Accuracy</h3>
              </div>
<!--              <div class="tw-flex tw-w-full tw-flex-auto tw-border-t tw-border-solid tw-border-brand-gray-2" />-->
              <div class="tw-flex tw-justify-center tw-p-6 tw-pt-5" v-if="!isLoading && !isCVAccuracyLoading">
                <GChart type="ColumnChart" :data="cvAccuracyData" :options="cvAccuracyOptions"/>
              </div>

            </div>
            <div v-else>
              <div class="tw-flex tw-justify-center">
                <h3 class="tw-pl-2 tw-pt-3 tw-flex tw-h-8 tw-items-center tw-text-lg tw-font-bold">Rolling Test Accuracy</h3>
              </div>
<!--              <div class="tw-flex tw-w-full tw-flex-auto tw-border-t tw-border-solid tw-border-brand-gray-2" />-->
                <div class="tw-flex tw-justify-center tw-p-6 tw-pt-5" v-if="!isLoading && !isCVAccuracyLoading">
                  <GChart type="ColumnChart" :data="rollingTestAccuracyData" :options="rollingTestAccuracyOptions"/>
                </div>
            </div>
          </v-card>
        </div>
        <div>
          <v-card>
          <h3 class="tw-font-bold  tw-py-2 tw-pl-2 tw-text-lg">Historic Actual vs Predicted Market Volume</h3>
            <div class="tw-flex tw-w-full tw-flex-auto tw-border-t tw-border-solid tw-border-brand-gray-2" />
            <div class="tw-flex tw-gap-x-4 tw-w-full tw-bg-white tw-px-3">
              <div class="tw-pt-3 tw-min-w-[14%] tw--mb-3">
                <label for="category" class="tw-text-sm">Category</label>
                <v-select
                  :disabled="historic_disabled"
                  :items="filtersCharts.categories.items"
                  :model-value="filtersCharts.categories.selected"
                  @update:modelValue="value=>selectFilterUpdated('categories', value)"
                  density="comfortable"
                ></v-select>
              </div>
              <div class="tw-pt-3 tw-min-w-[14%] tw--mb-3">
                <label for="projection_period" class="tw-text-sm">Projection Period</label>
                <v-select
                  :disabled="historic_disabled"
                  :items="filtersCharts.projected_period.items"
                  :model-value="filtersCharts.projected_period.selected"
                  @update:modelValue="value=>selectFilterUpdated('projected_period', value)"
                  density="comfortable"
                ></v-select>
              </div>
            </div>
          <div class="tw-w-full tw-grid-rows-2" v-if="!isLoading && !isHistoricPerformanceLoading">
            <div class="tw-h-1/6 tw-mt-4">
              <div class="tw-flex tw-ml-5">
                <div style="width:12px;height:12px;background: #A5A5A5;" class="tw-ml-3">
                </div>
                <div style="height:14px;" class="tw-text-xs tw-ml-1">Predicted Values</div>
                <div class="tw-flex">
                <div style="width:12px;height:12px;background: #5F5F5F;" class="tw-ml-3">
                </div>
                <div style="height:14px" class="tw-text-xs tw-ml-1">Actual Values</div>
                <div style="width:24px;height:3px;background: #7823DC;" class="tw-ml-3 tw-mt-1.5">
                </div>
                <div style="height:14px" class="tw-text-xs tw-ml-1">Prediction Accuracy</div>
                </div>
              </div>
            </div>
            <GChart type="LineChart" :options="lineChartOptions" :data="lineChartData"/>
            <div>
              <GChart type="ColumnChart" :data="columnChartData" :options="columnChartOptions" height="370"/>
            </div>
          </div>
        </v-card>
        </div>
      </div>
    </div>
  </div>
  <v-divider/>
</template>
