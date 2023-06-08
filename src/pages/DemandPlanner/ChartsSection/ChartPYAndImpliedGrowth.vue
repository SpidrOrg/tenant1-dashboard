<script>
import _ from 'lodash';
import { GChart } from 'vue-google-charts';

const DATA_CONFIG = [
  {
    key: 'pyVal',
    label: 'PY Actual',
    color: '#A5A5A5',
  },
  {
    key: 'impliedVal',
    label: 'Implied',
    color: '#F8D887',
  },
];

const dataKeys = _.map(DATA_CONFIG, (el) => el.key);

export default {
  name: 'ChartPYandImpliedGrowth',
  components: {
    GChart,
  },
  props: {
    projectedPeriod: {
      type: String,
      required: true,
    },
    pyVal: {
      type: [Number, String],
      required: true,
    },
    impliedVal: {
      type: [Number, String],
      required: true,
    },
    chartsScale: { type: Object, required: true },
  },
  data() {
    return {
      legendData: DATA_CONFIG,
    };
  },
  computed: {
    pyValNumeric() {
      return _.isNaN(_.toNumber(this.pyVal)) ? 0 : _.toNumber(this.pyVal);
    },
    impliedValNumeric() {
      return _.isNaN(_.toNumber(this.impliedVal))
        ? 0
        : _.toNumber(this.impliedVal);
    },
    chartData() {
      return [
        [
          '',
          dataKeys[0],
          { role: 'annotation' },
          dataKeys[1],
          { role: 'annotation' },
        ],
        [
          this.projectedPeriod,
          this.pyValNumeric,
          `${this.pyValNumeric}%`,
          this.impliedValNumeric,
          `${this.impliedValNumeric}%`,
        ],
      ];
    },
    chartOptions() {
      return {
        legend: { position: 'none' },
        tooltip: { trigger: 'none' },
        annotations: {
          textStyle: {
            color: '#000000',
            fontSize: 12,
          },
          datum: { stem: { length: 0 } },
          alwaysOutside: true,
        },
        bar: { groupWidth: '44%' },
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
        hAxis: {
          textStyle: {
            color: '#323232',
            fontName: 'Graphik',
            fontSize: 13,
          },
        },
        chartArea: {
          top: '10%',
          width: '70%',
          height: '80%',
        },
        colors: _.map(DATA_CONFIG, (el) => el.color),
      };
    },
  },
};
</script>

<template>
  <v-menu open-on-hover location="top">
    <template v-slot:activator="{ props }">
      <div
        class="tw-flex tw-flex-col tw-gap-y-2 desktop:tw-items-center small-laptop:tw-items-center"
      >
        <span
          v-bind="props"
          class="tw-font-medium tw-text-lg desktop:tw-text-base small-laptop:tw-text-base tw-cursor-default"
        >
          Implied Market Share
        </span>
        <div class="tw-flex tw-items-center tw-gap-x-3">
          <div
            v-for="item in legendData"
            :key="item.key"
            class="tw-flex tw-items-center tw-gap-x-1"
          >
            <span
              :style="`height: 12px; width: 12px; background: ${item.color}`"
            />
            <span class="tw-text-xs">{{ item.label }}</span>
          </div>
        </div>
      </div>
    </template>
    <div
      class="tw-w-96 tw-h-14 tw-p-2 tw-bg-white tw-border tw-rounded tw-border-[#D9D9D9] tw-shadow-2xl"
    >
      <p class="tw-text-sm tw-text-center">
        Size of the company in relation to its market and its competitors based
        on demand projections
      </p>
    </div>
  </v-menu>
  <GChart type="ColumnChart" :data="chartData" :options="chartOptions" />
</template>
