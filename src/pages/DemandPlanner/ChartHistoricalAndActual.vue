<script>
import _ from 'lodash';
import { GChart } from 'vue-google-charts';

const dataKeys = ["period", "Market Sensing", "Internal", "Actual"]

export default {
  name: "ChartHistoricalAndActual",
  components: {
    GChart,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  computed: {
    chartData(){
      return [
        [...dataKeys],
        ..._.map(this.data, v => {
          return _.map(dataKeys, k => v[k] === null ? 0 : v[k])
        })
      ]
    }
  },
  data(){
    return {
      chartOptions: {
        legend: { position: 'top' },
        colors: ['#570EAA', '#787878', '#C8A5F0', '#FFC107'],
        hAxis: {
          textStyle: {
            color: '#323232',
            fontName: 'Graphik',
            fontSize: 13,
          },
        },
        chartArea: {
          left: '4%',
          top: '10%',
          width: '100%',
          height: '80%',
        },
      }
    }
  }
}
</script>

<template>
  <span class="tw-font-medium tw-text-lg tw-cursor-default">
    Market Sensing Forecast vs Sales (%, YoY) – Historical Period
  </span>
  <GChart
    type="ColumnChart"
    :data="chartData"
    :options="chartOptions"
  />
</template>
