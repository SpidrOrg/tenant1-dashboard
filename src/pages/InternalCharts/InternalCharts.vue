<script>
import { GChart }  from 'vue-google-charts'
import TheHeader from './TheHeader'
export default {
  name: "InternalCharts",
  components:{
    GChart,
    TheHeader
  },
  data(){
    return {
      chartDataLoaded:false,
      columnChartData:[['Period','Internal','Actual'],['Dec21 - Feb22',3.2,2.4],['Jan22 - Mar22',2.5,1.6],['Feb22 - Apr22',1.8,1.1],['Mar22 - May22',1.5,1.2],['Apr22 - Jun22',2.3,1.4],['May22 - Jul22',1.6,1.8],['Jun22 - Aug22',0.8,0.3],['Jul22 - Sept22',1.3,1.2],['Aug22 - Oct22',0.6,0.8],['Sept22 - Nov22',0.7,0.9],['Oct22 - Dec22',1.3,0.8],['Nov22 - Jan23',1.6,1.2]],
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
        vAxis: {
          baselineColor: 'none',
          textPosition: 'none'
        }
      },
      lineChartData:[['Time Period', 'Market Sensing', 'Internal', 'Actual' ],
        ['Dec21 - Feb22', 29,26, 23],
        ['Jan22 - Mar22', 40,36, 30],
        ['Feb22 - Apr22', 30,28, 22],
        ['Mar22 - May22', 40,35, 30],
        ['Apr22 - Jun22', 36,19, 26],
        ['May22 - Jul22', 41,24, 32],
        ['Jun22 - Aug22', 25,23, 18],
        ['Jul22 - Sept22', 33,22, 13],
        ['Aug22 - Oct22', 44,36, 26],
        ['Sept22 - Nov22', 33,18, 22],
        ['Oct22 - Dec22', 38,28, 12],
        ['Nov22 - Jan23', 32,26, 23]
      ],
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
        vAxis: {
          baselineColor: 'none',
          textPosition: 'none'
        },
        chartArea:{
          left: '3%',
          width:'90%'
        },
      }
    }
  },

  created(){
    this.chartDataLoaded = true
  }
}
</script>

<template>
  <v-progress-circular indeterminate color="#7823DC" v-if="!chartDataLoaded" :size="70" :width="7" style="position: fixed;
    left: 50%;
    top: 35%;
  z-index: 1000;"/>
  <div class="tw-w-full tw-h-full tw-bg-brand-gray-1">
    <div class="tw-flex tw-h-8 tw-items-center tw-font-bold">
      Internal Charts
    </div>
    <div class="tw-flex tw-w-full tw-flex-auto tw-border-t tw-border-solid tw-border-brand-gray-2" />
    <div class="tw-py-5 tw-bg-brand-gray-1" v-if="chartDataLoaded">
      <TheHeader />
    </div>
    <div class="tw-w-full tw-border-t tw-border-solid tw-border-brand-gray-2" v-if="chartDataLoaded">
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
