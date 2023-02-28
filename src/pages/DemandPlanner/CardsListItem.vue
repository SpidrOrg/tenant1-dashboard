<script>
import { GChart } from 'vue-google-charts';

export default {
  name: 'CardsListItem',
  components: {
    GChart,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
    options: Object,
  },
  computed: {
    isModelAccuracyHidden() {
      return this.options.isModelAccuracyHidden || false;
    },
  },
  methods: {
    getColorCode(n) {
      if (Math.abs(n) >= 20) {
        return '#DC3545';
      }
      if (Math.abs(n) >= 6) {
        return '#FF9900';
      }
      return '#04BB46';
    },
    getActionButtonLabel(n) {
      if (Math.abs(n) >= 20) {
        return 'Review';
      }
      if (Math.abs(n) >= 6) {
        return 'Watch List';
      }
      return 'No Action';
    },
  },
};
</script>

<template>
  <div class="tw-w-full tw-h-full tw-px-3 tw-py-1">
    <div class="tw-flex tw-flex-col tw-py-2">
      <p style="color: #9291a5">Projected Period</p>
      <div class="tw-flex tw-gap-x-4 tw-items-center tw-w-full">
        <p class="tw-text-lg tw-font-medium">{{ data.period }}</p>
        <div class="tw-bg-brand-gray-4 tw-rounded">
          <p class="tw-p-1 tw-text-sm">Future {{ data.lag }} months</p>
        </div>
      </div>
    </div>
    <div class="tw-w-full tw-border-t tw-border-solid tw-border-brand-gray-2" />
    <div
      :class="`tw-grid tw-py-2 ${
        isModelAccuracyHidden ? 'tw-grid-cols-3' : 'tw-grid-cols-5 '
      }`"
    >
      <div class="tw-col-span-3">
        <p class="tw-text-sm tw-font-medium">Projected Growth (%YoY)</p>
        <div class="tw-grid tw-grid-cols-2 tw-pt-4">
          <div>
            <p class="tw-text-2xl tw-font-semibold">
              {{ `${data.internal}%` }}
            </p>
            <p class="tw-text-xs">Planned Internal Forecast</p>
          </div>
          <div>
            <p class="tw-text-2xl tw-font-semibold">
              {{ `${data.marketSensing}%` }}
            </p>
            <p class="tw-text-xs">Market Sensing Model Forecast</p>
          </div>
        </div>
      </div>
      <div
        class="tw-flex tw-flex-col tw-items-center tw-col-span-2"
        v-if="!isModelAccuracyHidden"
      >
        <p class="tw-text-sm tw-font-medium tw-pb-6">ML Model Accuracy</p>
        <div class="tw-relative tw-flex tw-items-center tw-w-20 tw-h-10">
          <div
            class="tw-absolute tw-z-10 tw-h-full tw-w-full tw-flex tw-items-center tw-justify-center tw-text-xl tw-font-semibold"
          >
            {{ Math.round(data.modelAccuracy.current, 0) }}%
          </div>
          <GChart
            type="PieChart"
            :data="[
              ['Effort', 'Percentage'],
              ['single', data.modelAccuracy.current],
              ['', 100 - data.modelAccuracy.current],
            ]"
            :options="{
              pieHole: 0.7,
              pieSliceTextStyle: {
                color: 'black',
                fontSize: '20px',
              },
              theme: 'maximized',
              legend: 'none',
              slices: {
                0: { color: '#9150E1', textStyle: { color: 'transparent' } },
                1: { color: '#E6E6E6', textStyle: { color: 'transparent' } },
              },
              height: 81,
              width: 81,
            }"
          />
        </div>
      </div>
    </div>
    <div
      class="tw-w-full tw-flex tw-justify-center tw-items-center tw-gap-3 tw-pt-2"
    >
      <div class="tw-flex tw-flex-col tw-items-center">
        <span
          class="tw-text-4xl tw-font-semibold"
          :style="{ color: getColorCode(data.variance) }"
        >
          {{ `${data.variance}%` }}
        </span>
        <span class="tw-text-xs">Variance</span>
      </div>
      <div>
        <v-btn
          :prepend-icon="
            Math.abs(data.variance) >= 20 ? 'mdi-alert-circle' : 'mdi-circle'
          "
          variant="outlined"
          :color="getColorCode(data.variance)"
          rounded="pill"
        >
          {{ getActionButtonLabel(data.variance)
          }}<v-icon end icon="mdi-chevron-right" />
        </v-btn>
      </div>
    </div>
  </div>
</template>
