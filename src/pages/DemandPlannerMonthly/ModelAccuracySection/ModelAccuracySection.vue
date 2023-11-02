<script>
import _ from 'lodash';
import { GChart } from 'vue-google-charts';
import fetchHistoricalModelAccuracyData from '@/api/DemandPlanner/fetchHistoricalModelAccuracyData';

import ModelAccuracyChart from './ModelAccuracyChart.vue';

export default {
  name: 'ModelAccuracySection',
  components: {
    GChart,
    ModelAccuracyChart,
  },
  props: {
    marketSensingRefreshDate: { type: String, required: true },
    category: { type: String, required: true },
    horizon: { type: String, required: true },
    forecastPeriodType: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      chartData: [],
      modelAccuracy: null,
      isLoading: true,
      error: null,
      horizonLoaded: null
    };
  },
  methods: {
    getColorCode(n) {
      switch (true) {
        case n >= 90:
          return '#8737E1';
        case n >= 80:
          return '#BF9CEC';
        case n >= 60:
          return '#C6C6C9';
        default:
          return '#A7A7AA';
      }
    },
    async fetchData() {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await fetchHistoricalModelAccuracyData({
          marketSensingRefreshDate: this.marketSensingRefreshDate,
          category: this.category,
          horizon: this.horizon,
          forecastPeriodType: this.forecastPeriodType,
        });

        const performance = _.get(response, 'performance');
        this.chartData = _.take(performance, _.size(performance) - 1);
        this.modelAccuracy = _.toNumber(_.last(_.last(performance)));
      } catch (e) {
        this.error = e;
      }
      this.isLoading = false;
      this.horizonLoaded = this.horizon;
    },
  },
  created() {
    this.fetchData();
  },
  updated(a, b, c) {
    if (this.horizonLoaded !== this.horizon){
      this.fetchData();
    }
  }
};
</script>

<template>
  <v-menu open-on-hover location="top">
    <template v-slot:activator="{ props }">
      <p
        v-bind="props"
        class="tw-text-lg desktop:tw-text-lg small-laptop:tw-text-lg tw-font-medium tw-text-center tw-pb-2"
      >
        ML Model Accuracy
      </p>
    </template>
    <div
      class="tw-w-96 tw-h-14 tw-p-2 tw-bg-white tw-border tw-rounded tw-border-[#D9D9D9] tw-shadow-2xl"
    >
      <p class="tw-text-sm tw-text-center">
        ML Model accuracy is the percentage of correctness of prediction by ML
        Model for the given dataset.
      </p>
    </div>
  </v-menu>
  <div id="modelAccuracyPieChart">
    <div
      class="tw-w-full tw-flex tw-justify-center tw-items-center"
      v-if="isLoading"
    >
      <v-progress-circular
        indeterminate
        color="#7823DC"
        :size="60"
        :width="8"
      />
    </div>
    <v-menu open-on-hover location="right" v-if="!isLoading && !error">
      <template v-slot:activator="{ props }">
        <div
          class="tw-relative tw-flex tw-items-center"
          v-bind="props"
          v-if="modelAccuracy"
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
                  color: getColorCode(modelAccuracy),
                  textStyle: { color: 'transparent' },
                },
                1: {
                  color: '#E6E6E6',
                  textStyle: { color: 'transparent' },
                },
              },
              height: 72,
              width: 72,
            }"
          />
        </div>
      </template>
      <ModelAccuracyChart
        v-if="chartData"
        :data="chartData"
        :getColorCode="getColorCode"
      />
    </v-menu>
  </div>
</template>
