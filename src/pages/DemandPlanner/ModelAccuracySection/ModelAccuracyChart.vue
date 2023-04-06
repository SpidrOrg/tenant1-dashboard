<script>
import _ from 'lodash';
import { GChart } from 'vue-google-charts';
import ModelAccuracyScaleIcon from '@/images/model-accuracy-scale.svg';

export default {
  name: 'ModelAccuracyChart',
  components: {
    GChart,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
    getColorCode: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      ModelAccuracyScaleIcon,
    };
  },
  computed: {
    chartData() {
      return [
        ['period', 'modelAccuracy', { role: 'style' }],
        ..._.map(this.data, (el) => {
          const modelAccuracy = _.toNumber(_.last(el));
          return [...el, `color: ${this.getColorCode(modelAccuracy)}`];
        }),
      ];
    },
  },
};
</script>

<template>
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
      :data="chartData"
      :options="{
        legend: { position: 'none' },
        tooltip: { trigger: 'none' },
        height: 240,
        width: 560,
        vAxis: {
          viewWindow: {
            max: 100,
            min: 0,
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
</template>
