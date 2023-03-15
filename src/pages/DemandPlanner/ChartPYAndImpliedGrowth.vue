<script>
import _ from "lodash";
import { GChart } from 'vue-google-charts';

export default {
  name: "ChartPYandImpliedGrowth",
  components: {
    GChart,
  },
  props: {
    projectedPeriod: {
      type: String,
      required: true,
    },
    pyVal: {
      type: Number,
      required: true,
    },
    impliedVal: {
      type: Number,
      required: true,
    },
  },
  computed: {
    chartData(){
      return [
        ['', 'PyActual', 'Implied'],
        [
          this.projectedPeriod,
          this.pyVal,
          this.impliedVal,
        ],
      ]
    },
    chartOptions(){
      return {
        legend: { position: 'top' },
        vAxis: {
          viewWindow: {
            max: _.add(_.max([_.toNumber(this.pyVal), _.toNumber(this.impliedVal)]), 5),
            min: _.subtract(_.min([_.toNumber(this.pyVal), _.toNumber(this.impliedVal)]), 5),
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
    :data="chartData"
    :options="chartOptions"
  />
</template>
