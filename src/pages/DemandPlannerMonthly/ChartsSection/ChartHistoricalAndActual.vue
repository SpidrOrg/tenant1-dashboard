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
    chartsScale: { type: Object, required: true },
  },
  computed: {
    chartColumns() {
      const columns = [];
      _.forEach(dataKeys, (key, i) => {
        columns.push(key);
        if (i > 0) columns.push({ role: 'annotation' });
      });
      return columns;
    },
    chartData() {
      return [
        [...this.chartColumns],
        ..._.map(this.data, (v) => {
          return _.map(this.chartColumns, (column, i) => {
            let key = column;
            if (_.get(key, 'role') === 'annotation') {
              key = this.chartColumns[i - 1];
              return v[key] === null || v[key] === undefined
                ? 'NA'
                : `${_.round(_.toNumber(v[key]), 0)}%`;
            }
            return v[key] === null || v[key] === undefined ? 0 : v[key];
          });
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
        annotations: {
          textStyle: {
            color: '#000000',
            fontSize: 12,
          },
          datum: { stem: { length: 0 } },
          alwaysOutside: true,
        },
        bar: { groupWidth: '76%' },
        hAxis: {
          textStyle: {
            color: '#323232',
            fontName: 'Graphik',
            fontSize: 13,
          },
        },
        vAxis: {
          gridlines: {
            count: 0,
          },
          textPosition: 'none',
          viewWindow: {
            max: _.get(this.chartsScale, 'max'),
            min: _.get(this.chartsScale, 'min'),
          },
        },
        chartArea: {
          top: '6%',
          width: '100%',
          height: '84%',
        },
      },
    };
  },
};
</script>

<template>
  <div class="tw-flex tw-flex-col tw-gap-y-2 small-laptop:tw-overflow-auto">
    <span
      class="tw-font-medium tw-text-lg desktop:tw-text-base small-laptop:tw-text-base tw-cursor-default"
    >
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
  <div class="tw-overflow-x-auto tw-overflow-y-hidden">
    <div class="tw-min-w-[800px]">
      <GChart type="ColumnChart" :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>
