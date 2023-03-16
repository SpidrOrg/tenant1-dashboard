<script>
import { GChart }  from 'vue-google-charts'
import fetchModelAccuracyData from "@/api/fetchModelAccuracyData";
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
      isLoading:false,
      cvAccuracy:true,
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
        cssClassNames:{
          legend:'legend'
        },
        legend: {position: 'top'},
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
        // vAxis: {
        //   baselineColor: 'none',
        //   textPosition: 'none'
        // }
      },
      lineChartData:[],
      lineChartOptions:{
        curveType: 'none',
        legend: { position: 'none' },
        colors: ['#8737E1'],
        height:100,
        series: {
          1: {lineDashStyle: [4, 4]}
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
        chartArea:{
          left: '3%',
          width:'100%',
          height:'70%'
        },
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
          return '#570EAA';
        case n >= 80:
          return '#AF7DEB';
        case n >= 60:
          return '#A5A5A5';
        default:
          return '#626262';
      }
    },
    selectFilterUpdated(filterName, currentSelection){
      this.filtersCharts[filterName].selected = currentSelection;
      this.filtersUpdated();
    },
    selectAccuracyFilterUpdated(filterName, currentSelection){
      this.filtersTestAccuracy[filterName].selected = currentSelection;
      this.filtersUpdated();
    },
    filtersUpdated(){
      this.$emit("updateFilters", this.filtersCharts);
    },
  },
  emits: ['updateFilters'],
  async created() {
    this.isLoading = true;
    let v = this;
    //try {
      this.apiData = await fetchModelAccuracyData();

      //Historic Performance data
      this.columnChartData.push(this.apiData[0].historic_performance.identifiers);
      _.forEach(this.apiData[0].historic_performance.data, function (data) {
        v.columnChartData.push(data);
      });
      //Historic performance end

     //Historic Performance accuracy data
      if(!this.apiData[0].historic_performance_accuracy.identifiers.includes({role: 'annotation', type: 'string'})){
        this.apiData[0].historic_performance_accuracy.identifiers.push({role: 'annotation', type: 'string'});
      }
      this.lineChartData.push(this.apiData[0].historic_performance_accuracy.identifiers);
      _.forEach(this.apiData[0].historic_performance_accuracy.data, function (data) {
        data.push(data[1])
      });
      _.forEach(this.apiData[0].historic_performance_accuracy.data, function (data) {
        v.lineChartData.push(data);
      });
      //Historic Performance accuracy data --end

      //CV Accuracy Data
      if(!this.apiData[0].cv_accuracy.identifiers.includes({ role: 'style' })){
        this.apiData[0].cv_accuracy.identifiers.push({ role: 'style' });
      }
      this.cvAccuracyData.push(this.apiData[0].cv_accuracy.identifiers);

      _.forEach(this.apiData[0].cv_accuracy.data, function (data) {
      data.push(`color: ${v.getColorCode(data[1])}`);
      });
    _.forEach(this.apiData[0].cv_accuracy.data, function (data) {
      v.cvAccuracyData.push(data);
    });
      //CV Accuracy Data --end

      //Rolling Test Accuracy Data
    if(!this.apiData[0].rolling_test_accuracy.identifiers.includes({ role: 'style' })){
      this.apiData[0].rolling_test_accuracy.identifiers.push({ role: 'style' });
    }
    this.rollingTestAccuracyData.push(this.apiData[0].rolling_test_accuracy.identifiers);
    _.forEach(this.apiData[0].rolling_test_accuracy.data, function (data) {
      data.push(`color: ${v.getColorCode(data[1])}`);
    });
    _.forEach(this.apiData[0].rolling_test_accuracy.data, function (data) {
        v.rollingTestAccuracyData.push(data);
      });
    //Rolling Test Accuracy Data --end

    // } catch (e) {
    //   this.error = e;
    // }
    this.isLoading = false;
    const options = await fetchModelAccuracyOptions().catch(() => null);
    if (options){
      this.filtersCharts.categories.items = options.categories;
      this.filtersCharts.projected_period.items = options.projected_period;
      this.filtersTestAccuracy.categories.items = options.categories;
    }
    // Add all option to the categories and customers filters
    this.filtersCharts.categories.items = _.concat(ALL_OPTION, this.filtersCharts.categories.items);
    this.filtersTestAccuracy.categories.items = _.concat(ALL_OPTION, this.filtersTestAccuracy.categories.items);

    this.selectFilterUpdated("categories", ALL_OPTION);
    this.selectAccuracyFilterUpdated("categories", ALL_OPTION);
    this.selectFilterUpdated("projected_period", this.filtersCharts.projected_period.items[0]);
  },
}
</script>

<template>
  <v-progress-circular indeterminate color="#7823DC" v-if="isLoading" :size="70" :width="7" style="position: fixed;
    left: 50%;
    top: 35%;
  z-index: 1000;"/>
  <div class="tw-w-full tw-h-full tw-bg-brand-gray-1">
    <div class="tw-flex tw-h-8 tw-items-center tw-font-bold">
      Model Accuracy
    </div>
    <div class="tw-flex tw-w-full tw-flex-auto tw-border-t tw-border-solid tw-border-brand-gray-2" />
    <div class="tw-w-full tw-border-t tw-border-solid tw-border-brand-gray-2" v-if="!isLoading">
      <div class="tw-grid tw-grid-rows-2 tw-gap-6">
        <div>
          <v-card class="tw-h-full">
            <div class="tw-font-bold  tw-py-2 tw-pl-2">
              Model Accuracy Forecast Performance
            </div>
            <div class="tw-flex tw-w-full tw-flex-auto tw-border-t tw-border-solid tw-border-brand-gray-2" />
            <div class="tw-flex tw-gap-x-4 tw-w-full tw-bg-white tw-px-3">
              <div class="tw-pl-2 tw-pt-5 tw-w-1/6">
                <v-select
                  label="All Categories"
                  :items="filtersTestAccuracy.categories.items"
                  :model-value="filtersTestAccuracy.categories.selected"
                  @update:modelValue="value=>selectAccuracyFilterUpdated('categories', value)"
                ></v-select>
              </div>
              <div class="tw-flex tw-items-center tw-gap-1.5">
                <p :class="`${cvAccuracy ? 'tw-font-medium' : ''}`">CV Accuracy</p>
                <div class="tw-flex tw-pt-5" style="color: #7823DC;">
                  <v-switch inset @click="cvAccuracy = !cvAccuracy"></v-switch>
                </div>
                <p :class="`${!cvAccuracy ? 'tw-font-medium' : ''}`">Rolling Test Accuracy</p>
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
              <div class="tw-flex tw-justify-center">
                <GChart type="ColumnChart" :data="cvAccuracyData" :options="cvAccuracyOptions"/>
              </div>

            </div>
            <div v-else>
              <div class="tw-flex tw-justify-center">
                <h3 class="tw-pl-2 tw-flex tw-h-8 tw-items-center tw-font-bold">Rolling Test Accuracy</h3>
              </div>
<!--              <div class="tw-flex tw-w-full tw-flex-auto tw-border-t tw-border-solid tw-border-brand-gray-2" />-->
                <div class="tw-flex tw-justify-center">
                  <GChart type="ColumnChart" :data="rollingTestAccuracyData" :options="rollingTestAccuracyOptions"/>
                </div>
            </div>
          </v-card>
        </div>
        <div>
          <v-card>
          <h3 class="tw-font-bold  tw-py-2 tw-pl-2">Model Accuracy Historic Performance</h3>
            <div class="tw-flex tw-w-full tw-flex-auto tw-border-t tw-border-solid tw-border-brand-gray-2" />
            <div class="tw-flex tw-gap-x-4 tw-w-full tw-bg-white tw-px-3">
              <div class="tw-pl-2 tw-pt-5 tw-w-1/6">
                <v-select
                  label="All Categories"
                  :items="filtersCharts.categories.items"
                  :model-value="filtersCharts.categories.selected"
                  @update:modelValue="value=>selectFilterUpdated('categories', value)"
                ></v-select>
              </div>
              <div class="tw-pl-2 tw-pt-5 tw-w-1/6">
                <v-select
                  :items="filtersCharts.projected_period.items"
                  :model-value="filtersCharts.projected_period.selected"
                  @update:modelValue="value=>selectFilterUpdated('projected_period', value)"
                ></v-select>
              </div>
            </div>
          <div class="tw-w-full tw-grid-rows-2">
            <div class="tw-h-1/6">
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
