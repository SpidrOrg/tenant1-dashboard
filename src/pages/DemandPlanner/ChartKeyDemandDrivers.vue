<script>
import _ from 'lodash';
import { GChart } from 'vue-google-charts';

export default {
  name: "ChartKeyDemandDrivers",
  components: {
    GChart,
  },
  props: {
    data: {
      type: Array,
      required: true,
    },
  },
  computed:{
    chartData(){
      return [
        ['X', 'Y'],
        ..._.map(this.data, v => {
          return [_.keys(v)[0], _.values(v)[0]]
        })
      ]
    }
  },
  data(){
    return {
      chartOptions: {
        legend: 'none',
        colors: ['#646F79'],
        vAxis: {
          textStyle: {
            color: '#1E1E1E',
            fontName: 'Graphik',
            fontSize: 12,
          },
        },
        chartArea: {
          top: '0',
          right: '4%',
          width: '60%',
          height: '90%',
        },
      }
    }
  }
}
</script>

<template>
  <v-menu open-on-hover location="top">
    <template v-slot:activator="{ props }">
          <span
            v-bind="props"
            class="tw-font-medium tw-text-lg tw-cursor-default"
          >
            Key Demand Drivers
          </span>
    </template>
    <div
      class="tw-w-96 tw-h-20 tw-p-2 tw-bg-white tw-border tw-rounded tw-border-[#D9D9D9] tw-shadow-2xl"
    >
      <p class="tw-text-sm tw-text-center">
        Most impactful types of data for the select projected period of
        demand predictions. These factors are accounting the most for the
        demand forecast.
      </p>
    </div>
  </v-menu>
  <GChart
    type="BarChart"
    :data="chartData"
    :options="chartOptions"
  />
</template>
