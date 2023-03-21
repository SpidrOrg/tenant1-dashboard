<script>
import { GChart } from 'vue-google-charts';
import ModelAccuracyScaleIcon from '@/images/model-accuracy-scale.svg';

export default {
  name: 'ModelAccuracyChart',
  components: {
    GChart,
  },
  props: {
    modelAccuracy: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      ModelAccuracyScaleIcon,
    };
  },
  methods: {
    getColorCode(n) {
      switch (true) {
        case n >= 90:
          return '#570EAA';
        case n >= 80:
          return '#AF7DEB';
        case n >= 60:
          return '#A5A5A5';
        default:
          return '#626262';
      }
    },
  },
};
</script>

<template>
  <v-menu open-on-hover location="right">
    <template v-slot:activator="{ props }">
      <div
        class="tw-relative tw-flex tw-items-center tw-w-20 tw-h-10"
        v-bind="props"
      >
        <div
          class="tw-absolute tw-z-10 tw-h-full tw-w-full tw-flex tw-items-center tw-justify-center tw-text-xl tw-font-semibold"
        >
          {{ Math.round(modelAccuracy, 0) }}%
        </div>
        <GChart
          type="PieChart"
          :data="[
            ['Effort', 'Percentage'],
            ['single', modelAccuracy],
            ['', 100 - modelAccuracy],
          ]"
          :options="{
            pieHole: 0.7,
            pieSliceTextStyle: {
              color: 'black',
              fontSize: '20px',
            },
            theme: 'maximized',
            legend: 'none',
            tooltip: { trigger: 'none' },
            slices: {
              0: {
                color: '#9150E1',
                textStyle: { color: 'transparent' },
              },
              1: {
                color: '#E6E6E6',
                textStyle: { color: 'transparent' },
              },
            },
            height: 81,
            width: 81,
          }"
        />
      </div>
    </template>
    <div
      class="tw-w-full tw-h-full tw-p-3 tw-bg-white tw-border tw-rounded tw-border-[#D9D9D9] tw-shadow-2xl"
    >
      <h1 class="tw-text-xl tw-font-medium">
        Model Accuracy (Rolling Test) for past 6 months
      </h1>
      <div class="tw-w-full tw-border tw-border-solid tw-border-brand-gray-2" />
      <div class="tw-w-full tw-py-3 tw-px-5 tw-flex tw-justify-center">
        <img :src="ModelAccuracyScaleIcon" />
      </div>
      <GChart
        type="ColumnChart"
        :data="[
          ['Time Period', 'Model Accuracy', { role: 'style' }],
          ['Jun 22-Aug 22', 92, `color: ${getColorCode(92)}`],
          ['Jul 22-Sep 22', 88, `color: ${getColorCode(88)}`],
          ['Aug 22-Oct 22', 76, `color: ${getColorCode(76)}`],
          ['Sep 22-Nov 22', 95, `color: ${getColorCode(95)}`],
          ['Oct 22-Dec 22', 59, `color: ${getColorCode(59)}`],
          ['Nov 22-Jan 23', 96, `color: ${getColorCode(96)}`],
        ]"
        :options="{
          legend: { position: 'none' },
          tooltip: { trigger: 'none' },
          height: 240,
          width: 560,
          vAxis: {
            viewWindow: {
              max: 100,
            },
          },
          hAxis: {
            textStyle: {
              color: '#1E1E1E',
              fontName: 'Graphik',
              fontSize: 11,
            },
          },
          chartArea: {
            left: '6%',
            bottom: '12%',
            width: '100%',
            height: '84%',
          },
        }"
      />
    </div>
  </v-menu>
</template>
