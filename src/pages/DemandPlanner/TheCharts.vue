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
      keyDemandDriversChartOptions: {
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
      },
      marketSensingChartOptions: {
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
      },
      impliedMarketShareChartOptions: {
        legend: { position: 'top' },
        vAxis: {
          viewWindow: {
            max: 40,
            min: 0,
          },
        },
        hAxis: {
          textStyle: {
            color: '#323232',
            fontName: 'Graphik',
            fontSize: 13,
          },
        },
        chartArea: {
          left: '16%',
          top: '10%',
          width: '70%',
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
    <div class="tw-col-span-1" v-if="data.keyDemandDriversChartData">
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
        :data="data.keyDemandDriversChartData"
        :options="keyDemandDriversChartOptions"
      />
    </div>
    <div class="tw-col-span-1" v-if="data.impliedMarketShareChartData">
      <v-menu open-on-hover location="top">
        <template v-slot:activator="{ props }">
          <span
            v-bind="props"
            class="tw-font-medium tw-text-lg tw-text-center tw-cursor-default"
          >
            Implied Market Share
          </span>
        </template>
        <div
          class="tw-w-96 tw-h-14 tw-p-2 tw-bg-white tw-border tw-rounded tw-border-[#D9D9D9] tw-shadow-2xl"
        >
          <p class="tw-text-sm tw-text-center">
            Size of the company in relation to its market and its competitors
            based on demand projections
          </p>
        </div>
      </v-menu>
      <GChart
        type="ColumnChart"
        :data="data.impliedMarketShareChartData"
        :options="impliedMarketShareChartOptions"
      />
    </div>
    <div class="tw-col-span-2" v-if="data.marketSensingChartData">
      <span class="tw-font-medium tw-text-lg tw-cursor-default">
        Market Sensing Forecast vs Sales (%, YoY) – Historical Period
      </span>
      <GChart
        type="ColumnChart"
        :data="data.marketSensingChartData"
        :options="marketSensingChartOptions"
      />
    </div>
  </div>
</template>
