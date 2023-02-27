<script>
import { GChart } from 'vue-google-charts';

export default {
  name: 'TheCharts',
  components: {
    GChart,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      barChartOptions: {
        legend: 'none',
        colors: ['#646F79'],
        chartArea: {
          left: '24%',
          top: '0',
          width: '90%',
          height: '90%',
        },
      },
      columnChartOptions: {
        legend: { position: 'top' },
        colors: ['#570EAA', '#787878', '#C8A5F0', '#F4BE37'],
        chartArea: {
          left: '4%',
          width: '100%',
          height: '90%',
        },
      },
      impliedMarketChartOptions: {
        legend: { position: 'top' },
        vAxis: {
          viewWindow: {
            max: 20,
            min: 0,
          },
        },
        chartArea: {
          left: '12%',
          top: '16%',
          width: '80%',
          height: '80%',
        },
        colors: ['#A5A5A5', '#F8D887'],
      },
    };
  },
};
</script>

<template>
  <div class="tw-grid tw-grid-cols-4 tw-gap-4" v-if="data">
    <div class="tw-col-span-1">
      <div v-if="data.barChartData">
        <p class="tw-font-medium tw-text-lg">Key Demand Drivers</p>
        <GChart
          type="BarChart"
          :data="data.barChartData"
          :options="barChartOptions"
        />
      </div>
    </div>
    <div class="tw-col-span-1">
      <div v-if="data.impliedMarketChartData">
        <p class="tw-font-medium tw-text-lg tw-text-center">
          Implied Market Share
        </p>
        <GChart
          type="ColumnChart"
          :data="data.impliedMarketChartData"
          :options="impliedMarketChartOptions"
        />
      </div>
    </div>
    <div class="tw-col-span-2">
      <div v-if="data.columnChartData">
        <p class="tw-font-medium tw-text-lg">
          Market Sensing Forecast vs Sales (%, YoY) – Historical Period
        </p>
        <GChart
          type="ColumnChart"
          :data="data.columnChartData"
          :options="columnChartOptions"
        />
      </div>
    </div>
  </div>
</template>
