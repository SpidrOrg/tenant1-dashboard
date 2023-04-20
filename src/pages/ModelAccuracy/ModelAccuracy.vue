<script>
import { GChart }  from 'vue-google-charts'
import fetchModelAccuracyData from "@/api/fetchModelAccuracyData";
import fetchCVRollingAccuracyData from '@/api/fetchCVRollingAccuracyData';
import _ from "lodash";
import fetchModelAccuracyOptions from "@/api/fetchModelAccuracyOptions";
export const ALL_OPTION = "All";
export default {
  name: "InternalCharts",
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
        height:370,
        tooltip: { trigger: 'none' },
        legend: {position: 'none'},
        colors: ['#A5A5A5', '#5F5F5F'],
        hAxis : {
          textStyle : {
            fontSize: 10
          }
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
        // vAxis: {
        //   baselineColor: 'none',
        //   textPosition: 'none'
        // }
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
        // hAxis: {
        //   baselineColor: 'none',
        //   textPosition: 'none'
        // },
        chartArea:{
          left: '3%',
          width:'90%',
          height:'90%'
        },
      },
      // cvAccuracyData:[
      //   ['Period','Predicted Values', { role: 'style' }],
      //   ['1-3 months',92, `color: ${this.getColorCode(92)}`],
      //   ['4-6 months',88, `color: ${this.getColorCode(88)}`],
      //   ['6-9 months',75, `color: ${this.getColorCode(75)}`],
      //   ['10-12 months',89, `color: ${this.getColorCode(89)}`],
      //   ['1-6 months',93, `color: ${this.getColorCode(93)}`],
      //   ['1-12 months',61, `color: ${this.getColorCode(61)}`]
      // ],
      cvAccuracyData:[],
      cvAccuracyOptions:{
        height:314,
        width:720,
        colors: ['#570EAA'],
        legend:{
          position:'none'
        },
        annotations: {
          textStyle: {
            color: '#000000',
            fontSize: 12,
          },
          datum: { stem: { length: 0 } },
          alwaysOutside: true,
        },
        tooltip: { trigger: 'none' },
        chartArea:{
          left: '3%',
          width:'100%',
          height:'70%'
        },
        vAxis: {
        gridlines: {
            count: 0
        },
        textPosition: 'none',
      }
      },
      // rollingTestAccuracyData:[
      //   ['Period','Predicted Values',{role:'style'}],
      //   ['1-3 months',96,`color: ${this.getColorCode(96)}`],
      //   ['4-6 months',85,`color: ${this.getColorCode(85)}`],
      //   ['6-9 months',90,`color: ${this.getColorCode(90)}`],
      //   ['10-12 months',88,`color: ${this.getColorCode(88)}`],
      //   ['1-6 months',93,`color: ${this.getColorCode(93)}`],
      //   ['1-12 months',89,`color: ${this.getColorCode(89)}`]
      // ],
      rollingTestAccuracyData:[],
      rollingTestAccuracyOptions:{
        height:314,
        width:720,
        colors: ['#570EAA'],
        legend:{
          position:'none'
        },
        annotations: {
          textStyle: {
            color: '#000000',
            fontSize: 12,
          },
          datum: { stem: { length: 0 } },
          alwaysOutside: true,
        },
        vAxis: {
          gridlines: {
            count: 0
        },
        textPosition: 'none',
      },
        tooltip: { trigger: 'none' },
        chartArea:{
          left: '3%',
          width:'100%',
          height:'70%',
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
          return '#AF7DEB';
        case n >= 60:
          return '#B9B9B9';
        default:
          return '#8C8C8C';
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
      const response = await fetchModelAccuracyData({categoriesHistoric: selectedHistoricCategories === ALL_OPTION ? "*" : selectedHistoricCategories,projected_period: selectedprojectedPeriod});
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
          v.lineChartData.push([data[0],data[1],data[1]]);
        });
     }
      
      //Historic Performance accuracy data --end

      //CV Accuracy Data
      if(!this.cvAccuracyData.length){
        this.cvAccuracyData.push(['Period','Predicted Values',{'role':'annotation'},{ role: 'style' }]);
        
        _.forEach(this.apiData.cvAccuracyData, function (data) {
          v.cvAccuracyData.push([data['period'],data['value'],data['value']+'%',`color: ${v.getColorCode(data['value'])}`]);
        });
        
      }
      //CV Accuracy Data --end

        //Rolling Test Accuracy Data
        if(!this.rollingTestAccuracyData.length){
          this.rollingTestAccuracyData.push(['Period','Predicted Values',{'role':'annotation'},{ role: 'style' }]);
        
          _.forEach(this.apiData.rollingAccuracyData, function (data) {
            v.rollingTestAccuracyData.push([data['period'],data['value'],data['value']+'%',`color: ${v.getColorCode(data['value'])}`]);
          });
        }
        //Rolling Test Accuracy Data --end
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
    },2000),
    async filtersAccuracyUpdated(){
      let v = this;
      if(this.firstTimeLoad){
        this.isLoading = true;
        this.isCVAccuracyLoading = false;
      } else {
        this.isLoading = false;
        this.isCVAccuracyLoading = true;
        this.accuracy_disabled = true;
      }
      const selectedAccuracyCategories = _.get(this.filtersTestAccuracy, "categories.selected");
      const response = await fetchCVRollingAccuracyData({categoriesAccuracy: selectedAccuracyCategories === ALL_OPTION ? "*" : selectedAccuracyCategories});
            if (!_.isEmpty(response)){
                  this.apiData = response;

        //Historic Performance data
        if(!this.columnChartData.length){
          this.columnChartData.push(['Period','Predicted Values',{'role':'annotation'},'Actual Values',{'role':'annotation'}]);
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
          v.lineChartData.push([data[0],data[1],data[1]]);
        });
        
     }
     }
      
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
    
    const options = await fetchModelAccuracyOptions().catch(() => null);
    if (options){
      this.filtersCharts.categories.items = options.categories;
      this.filtersCharts.projected_period.items = options.msTimeHorizon;
      this.filtersTestAccuracy.categories.items = options.categories;
    }
    // Add all option to the categories and customers filters
    this.filtersCharts.categories.items = this.filtersCharts.categories.items;
    this.filtersTestAccuracy.categories.items =this.filtersTestAccuracy.categories.items;

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
      <div class="tw-grid tw-grid-rows-2 tw-gap-6">
        <div>
          <v-card class="tw-h-full">
            <div class="tw-font-bold  tw-py-2 tw-pl-2 tw-text-lg">
              Model Accuracy Forecast Performance
            </div>
            <div class="tw-flex tw-w-full tw-flex-auto tw-border-t tw-border-solid tw-border-brand-gray-2" />
            <div class="tw-flex tw-gap-x-4 tw-w-full tw-bg-white tw-px-3">
              <div class="tw-pl-2 tw-pt-5 tw-w-1/6">
                <label for="category" class="tw-text-sm">Category</label>
                <v-select
                  :disabled="accuracy_disabled"
                  :items="filtersTestAccuracy.categories.items"
                  :model-value="filtersTestAccuracy.categories.selected"
                  @update:modelValue="value=>selectAccuracyFilterUpdated('categories', value)"
                ></v-select>
              </div>
              <div class="tw-flex tw-items-center tw-gap-1.5 tw-mt-3">
                <p :class="`${!cvAccuracy ? 'tw-font-medium' : ''}`" >Rolling Test Accuracy</p>
                <div class="tw-flex tw-pt-5" style="color: #7823DC;">
                  <v-switch inset @click="cvAccuracy = !cvAccuracy"></v-switch>
                </div>
                <p :class="`${cvAccuracy ? 'tw-font-medium' : ''}`">CV Accuracy</p>
            </div>

              <div class="tw-flex tw-justify-end tw-w-7/12">
                <img src="../../assets/model-accuracy-scale.svg" class="tw-h-full"/>
              </div>
            </div>
            <div v-if="cvAccuracy" class="tw-block tw-m-auto">
              <div class="tw-flex tw-justify-center">
                <h3 class="tw-pl-2 tw-flex tw-h-8 tw-justify-center tw-font-bold">CV Accuracy</h3>
              </div>
<!--              <div class="tw-flex tw-w-full tw-flex-auto tw-border-t tw-border-solid tw-border-brand-gray-2" />-->
              <div class="tw-flex tw-justify-center" v-if="!isLoading && !isCVAccuracyLoading">
                <GChart type="ColumnChart" :data="cvAccuracyData" :options="cvAccuracyOptions"/>
              </div>

            </div>
            <div v-else>
              <div class="tw-flex tw-justify-center">
                <h3 class="tw-pl-2 tw-flex tw-h-8 tw-items-center tw-font-bold">Rolling Test Accuracy</h3>
              </div>
<!--              <div class="tw-flex tw-w-full tw-flex-auto tw-border-t tw-border-solid tw-border-brand-gray-2" />-->
                <div class="tw-flex tw-justify-center" v-if="!isLoading && !isCVAccuracyLoading">
                  <GChart type="ColumnChart" :data="rollingTestAccuracyData" :options="rollingTestAccuracyOptions"/>
                </div>
            </div>
          </v-card>
        </div>
        <div>
          <v-card>
          <h3 class="tw-font-bold  tw-py-2 tw-pl-2 tw-text-lg">Historic Actual vs Predicted Market Value</h3>
            <div class="tw-flex tw-w-full tw-flex-auto tw-border-t tw-border-solid tw-border-brand-gray-2" />
            <div class="tw-flex tw-gap-x-4 tw-w-full tw-bg-white tw-px-3">
              <div class="tw-pl-2 tw-pt-5 tw-w-1/6">
                <label for="category" class="tw-text-sm">Category</label>
                <v-select
                  :disabled="historic_disabled"
                  :items="filtersCharts.categories.items"
                  :model-value="filtersCharts.categories.selected"
                  @update:modelValue="value=>selectFilterUpdated('categories', value)"
                ></v-select>
              </div>
              <div class="tw-pl-2 tw-pt-5 tw-w-1/6">
                <label for="projection_period" class="tw-text-sm">Projection Period</label>
                <v-select
                  :disabled="historic_disabled"
                  :items="filtersCharts.projected_period.items"
                  :model-value="filtersCharts.projected_period.selected"
                  @update:modelValue="value=>selectFilterUpdated('projected_period', value)"
                ></v-select>
              </div>
            </div>
          <div class="tw-w-full tw-grid-rows-2" v-if="!isLoading && !isHistoricPerformanceLoading">
            <div class="tw-h-1/6">
              <div class="tw-flex">
                <div style="width:21px;height:21px;background: #A5A5A5;" class="tw-ml-3">
                </div>
                <div style="height:21px" class="tw-ml-1">Predicted Values(USD)</div>
                <div class="tw-flex">
                <div style="width:21px;height:21px;background: #5F5F5F;" class="tw-ml-3">
                </div>
                <div style="height:21px" class="tw-ml-1">Actual Values(USD)</div>
                <div style="width:21px;height:21px;background: #7823DC;" class="tw-ml-3">
                </div>
                <div style="height:21px" class="tw-ml-1">Prediction Accuracy</div>
                </div>
              </div>
              
              <GChart type="LineChart" :options="lineChartOptions" :data="lineChartData"/>
            </div>
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
