<script>
import _ from 'lodash';
import { GChart } from 'vue-google-charts';

const DATA_CONFIG = [
  {
    key: 'period',
    label: 'Period',
    color: '',
  },
  {
    key: 'Internal',
    label: 'Internal Forecast',
    color: '#787878',
  },
  {
    key: 'Market Sensing',
    label: 'Market Sensing Forecast',
    color: '#570EAA',
  },
  {
    key: 'Adjusted',
    label: 'Adjusted Internal',
    color: '#FFC107',
  },
  {
    key: 'Actual',
    label: 'Sales',
    color: '#C8A5F0',
  },
];

const dataKeys = _.map(DATA_CONFIG, (el) => el.key);

export default {
  name: 'ChartHistoricalAndActual',
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
    chartData() {
      return [
        [...dataKeys],
        ..._.map(this.data, (v) => {
          return _.map(dataKeys, (k) =>
            v[k] === null || v[k] === undefined ? 0 : v[k]
          );
        }),
      ];
    },
  },
  data() {
    return {
      legendData: DATA_CONFIG.slice(1),
      chartOptions: {
        legend: { position: 'none' },
        tooltip: { trigger: 'none' },
        series: {
          0: { color: DATA_CONFIG[1].color },
          1: { color: DATA_CONFIG[2].color },
          2: { color: DATA_CONFIG[3].color },
          3: { color: DATA_CONFIG[4].color },
        },
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
    };
  },
};
</script>

<template>
  <div class="tw-flex tw-flex-col tw-gap-y-2">
    <span class="tw-font-medium tw-text-lg tw-cursor-default">
      Market Sensing Forecast vs Sales (%, YoY) – Historical Period
    </span>
    <div class="tw-flex tw-items-center tw-gap-x-3">
      <div
        v-for="item in legendData"
        :key="item.key"
        class="tw-flex tw-items-center tw-gap-x-1"
      >
        <span :style="`height: 12px; width: 12px; background: ${item.color}`" />
        <span class="tw-text-xs">{{ item.label }}</span>
      </div>
    </div>
  </div>
  <GChart type="ColumnChart" :data="chartData" :options="chartOptions" />
</template>
