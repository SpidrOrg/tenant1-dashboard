<script>
import _ from 'lodash';
import { GChart } from 'vue-google-charts';

export default {
  name: 'ChartKeyDemandDrivers',
  components: {
    GChart,
  },
  props: {
    data: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      dialogIsShown: false,
      selectedItem: null,
      source: 'IHS',
      dataPoints: [
        { label: 'Data point 1', value: '23.0%' },
        { label: 'Data point 2', value: '3.4%' },
        { label: 'Data point 3', value: '2.0%' },
        { label: 'Data point 4', value: '5.5%' },
        { label: 'Data point 5', value: '4.05%' },
        { label: 'Data point 6', value: '53.0%' },
        { label: 'Data point 7', value: '2.0%' },
        { label: 'Data point 8', value: '5.5%' },
        { label: 'Data point 9', value: '4.05%' },
        { label: 'Data point 10', value: '5.0%' },
      ],
      chartEvents: {
        click: (e) => {
          const { targetID } = e;
          const [el, , index] = _.split(targetID, '#');
          if (el === 'bar') {
            this.selectedItem = this.chartData[_.toNumber(index) + 1];
            this.dialogIsShown = true;
          } else {
            this.dialogIsShown = false;
          }
        },
      },
    };
  },
  methods: {
    closeDialog() {
      this.dialogIsShown = false;
    },
  },
  computed: {
    chartData() {
      return [
        ['X', 'Y', { role: 'annotation' }],
        ..._.map(this.data, (v) => {
          return [
            _.keys(v)[0],
            _.values(v)[0],
            `${_.round(_.values(v)[0], 1)}%`,
          ];
        }),
      ];
    },
    dataValues() {
      return _.map(this.data, (v) => {
        return _.values(v)[0];
      });
    },
    chartOptions() {
      return {
        legend: 'none',
        tooltip: { trigger: 'none' },
        colors: ['#646F79'],
        annotations: {
          textStyle: {
            color: '#000000',
            fontSize: 12,
          },
          datum: { stem: { length: 2 } },
          alwaysOutside: true,
        },
        vAxis: {
          textStyle: {
            color: '#1E1E1E',
            fontName: 'Graphik',
            fontSize: 12,
          },
        },
        hAxis: {
          gridlines: {
            count: 0,
          },
          textPosition: 'none',
          viewWindow: {
            max: _.add(_.max(this.dataValues), 5),
            min: _.subtract(_.min(this.dataValues), 5),
          },
        },
        chartArea: {
          right: '8%',
          width: '60%',
          height: '90%',
        },
      };
    },
  },
};
</script>

<template>
  <div class="tw-flex tw-flex-col tw-justify-between tw-h-full">
    <v-menu open-on-hover location="top">
      <template v-slot:activator="{ props }">
        <span
          v-bind="props"
          class="tw-font-medium tw-text-lg desktop:tw-text-base tw-cursor-default"
        >
          Key Demand Drivers
        </span>
      </template>
      <div
        class="tw-w-96 tw-h-20 tw-p-2 tw-bg-white tw-border tw-rounded tw-border-[#D9D9D9] tw-shadow-2xl"
      >
        <p class="tw-text-sm tw-text-center">
          Most impactful types of data for the select projected period of demand
          predictions. These factors are accounting the most for the demand
          forecast.
        </p>
      </div>
    </v-menu>
    <GChart
      type="BarChart"
      :data="chartData"
      :options="chartOptions"
      :events="chartEvents"
      ref="chartKeyDemandDrivers"
    />
    <v-dialog
      width="1040"
      :close-on-content-click="false"
      v-model="dialogIsShown"
    >
      <div class="tw-w-full tw-bg-white tw-px-5 tw-py-4 tw-overflow-auto">
        <div class="tw-flex tw-justify-between">
          <div class="tw-flex tw-flex-col tw-items-start">
            <span class="tw-text-lg tw-text-brand-gray-3"
              >Key Demand Drivers</span
            >
            <span class="tw-text-2xl tw-font-medium tw-text-black">{{
              selectedItem[0]
            }}</span>
          </div>
          <!-- <div class="tw-flex tw-flex-col tw-items-start">
            <span class="tw-text-lg tw-text-brand-gray-3">Source</span>
            <span class="tw-text-2xl tw-font-medium tw-text-black">{{
              source
            }}</span>
          </div> -->
          <v-btn variant="plain" icon="mdi-close" @click="closeDialog"></v-btn>
        </div>
        <ul class="tw-py-4">
          <li
            v-for="(dp, index) in dataPoints"
            :key="dp.label"
            :class="`tw-flex tw-justify-between tw-items-center tw-px-2 tw-py-3 ${
              index % 2 !== 0 ? 'tw-bg-white' : 'tw-bg-brand-gray-1'
            }`"
          >
            <span>{{ dp.label }}</span>
            <span>{{ source }}</span>
            <span>{{ dp.value }}</span>
          </li>
        </ul>
      </div>
    </v-dialog>
  </div>
</template>
