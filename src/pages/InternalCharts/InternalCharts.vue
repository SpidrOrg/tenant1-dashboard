<script>
import { GChart }  from 'vue-google-charts'
export default {
  name: "InternalCharts",
  components:{
    GChart
  },
  data(){
    return {
      chartDataLoaded:false,
      columnChartData:[['Period','Internal','Actual'],['Dec21 - Feb22',3.2,2.4],['Jan22 - Mar22',2.5,1.6],['Feb22 - Apr22',1.8,1.1],['Mar22 - May22',1.5,1.2],['Apr22 - Jun22',2.3,1.4],['May22 - Jul22',1.6,1.8],['Jun22 - Aug22',0.8,0.3],['Jul22 - Sept22',1.3,1.2],['Aug22 - Oct22',0.6,0.8],['Sept22 - Nov22',0.7,0.9],['Oct22 - Dec22',1.3,0.8],['Nov22 - Jan22',1.6,1.2]],
      columnChartOptions:{
        legend: {position: 'top'},
        colors: ['#787878', '#B991EB']
      },
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
  <div class="tw-w-full tw-h-8 tw-bg-brand-gray-1">
    <div class="tw-w-full  tw-border-t tw-border-solid tw-border-brand-gray-2" v-if="chartDataLoaded">
      <div class="tw-align-center tw-grid tw-grid-cols-1">
        <div>
          <GChart type="ColumnChart" :data="columnChartData" :options="columnChartOptions"/>
        </div>
      </div>
    </div>
  </div>
</template>
