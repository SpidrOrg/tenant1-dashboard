<script>
import _ from 'lodash';
import GoogleChart from '@/components/GoogleChart';
import fetchDemandForecastData from '@/api/HeatMap/fetchDemandForecastData';

const DATA_CONFIG = [
  {
    key: 'period',
    label: 'Time Period',
    color: '',
  },
  {
    key: 'msForecastGrowth',
    label: 'Market Sensing Forecast',
    color: '#570EAA',
    legendStyle: 'solid',
  },
  {
    key: 'internalForecastGrowth',
    label: 'Internal Forecast',
    color: '#8C8C8C',
    legendStyle: 'dashed',
  },
  {
    key: 'actualGrowth',
    label: 'Sales',
    color: '#B991EB',
    legendStyle: 'solid',
  },
];

const dataKeys = _.map(DATA_CONFIG, (el) => el.key);

export default {
  name: 'TooltipChart',
  props: {
    marketSensingRefreshDate: { type: String, required: true },
    valueORvolume: { type: String, required: true },
    category: { type: String, required: true },
    customer: { type: String, required: true },
    lag: { type: Number, required: true },
  },
  components: {
    GoogleChart,
  },
  data() {
    return {
      apiData: [],
      isLoading: true,
      error: null,
      legendData: DATA_CONFIG.slice(1),
    };
  },
  async created() {
    this.isLoading = true;
    try {
      this.apiData = await fetchDemandForecastData({
        marketSensingRefreshDate: this.marketSensingRefreshDate,
        valueORvolume: this.valueORvolume,
        category: this.category,
        customer: this.customer,
        lag: this.lag,
      });
    } catch (e) {
      this.error = e;
      this.closeMenu();
    }
    this.isLoading = false;
  },
  emits: ['closeEvent'],
  methods: {
    closeMenu() {
      this.$emit('closeEvent');
    },
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
        ..._.map(this.apiData, (v) => {
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
    chartOptions() {
      return {
        title: '',
        curveType: 'none',
        legend: { position: 'none' },
        tooltip: { trigger: 'none' },
        width: 850,
        height: 350,
        annotations: {
          textStyle: {
            color: '#000000',
            fontSize: 13,
          },
          datum: { stem: { length: 0 } },
          // alwaysOutside: true,
        },
        hAxis: {
          textStyle: {
            color: '#323232',
            fontName: 'Graphik',
            fontSize: 12,
          },
        },
        vAxis: {
          // gridlines: {
          //   count: 0,
          // },
        },
        chartArea: {
          top: '4%',
          width: '90%',
          height: '84%',
        },
        series: {
          0: { color: DATA_CONFIG[1].color },
          1: { color: DATA_CONFIG[2].color, lineDashStyle: [6, 6] },
          2: { color: DATA_CONFIG[3].color },
        },
      };
    },
  },
};
</script>

<template>
  <div
    class="tw-w-full tw-h-full tw-p-3 tw-bg-white tw-border-2 tw-rounded tw-border-[#D9D9D9] tw-shadow-2xl tw-z-10"
  >
    <div
      class="tw-w-60 tw-h-60 tw-flex tw-justify-center tw-items-center"
      v-if="isLoading"
    >
      <v-progress-circular
        indeterminate
        color="#7823DC"
        :size="60"
        :width="10"
      />
    </div>
    <div v-if="!isLoading && apiData.length > 0">
      <div class="tw-flex tw-items-center tw-w-full">
        <h1 class="tw-text-xl tw-font-medium">
          Demand Forecast : {{ category }} / {{ customer }}
        </h1>
        <div class="tw-flex tw-items-center tw-ml-auto">
          <v-btn variant="plain" icon="mdi-close" @click="closeMenu"></v-btn>
        </div>
      </div>
      <div class="tw-w-full tw-border tw-border-solid tw-border-brand-gray-2" />
      <div class="tw-flex tw-items-center tw-pt-3 tw-px-4">
        <div
          v-for="item in legendData"
          :key="item.key"
          class="tw-flex tw-items-center tw-gap-x-1 tw-pl-3"
        >
          <span
            :style="`width: 24px; border: 3px ${item.legendStyle} ${item.color}`"
          />
          <span class="tw-text-xs tw-text-black">{{ item.label }}</span>
        </div>
      </div>
      <div class="tw-w-full tw-flex tw-justify-center tw-pt-4">
        <GoogleChart
          type="LineChart"
          :options="chartOptions"
          :data="chartData"
        />
      </div>
    </div>
    <div v-if="!isLoading && error">
      <v-alert type="error" :text="error.toString()"></v-alert>
    </div>
  </div>
</template>
