<script>
import _ from 'lodash';
import ModelAccuracyChart from './ModelAccuracyChart.vue';

export default {
  name: 'CardsListItem',
  components: {
    ModelAccuracyChart,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
    options: Object,
  },
  data(){
    return {
      //
      lodSubtract: _.subtract,
      lodToNumber: _.toNumber
    }
  },
  computed: {
    isModelAccuracyHidden() {
      return this.options.isModelAccuracyHidden || false;
    },
  },
  methods: {
    lodGetNumeric(obj, path, isPercentValue = true){
      const val = _.get(obj, path, null);
      if (val === null || _.isNaN(val) || !_.isNumber(val)){
        return "NA"
      }
      return `${val}${isPercentValue ? "%": ""}`
    },
    getColorCode(num) {
      const n = _.toNumber(num);
      if (Math.abs(n) >= 20) {
        return '#DC3545';
      }
      if (Math.abs(n) >= 6) {
        return '#FF9900';
      }
      return '#04BB46';
    },
    getActionButtonLabel(num) {
      const n = _.toNumber(num);
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
        <p class="tw-text-lg tw-font-medium">{{ data.label }}</p>
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
        <v-menu open-on-hover location="top">
          <template v-slot:activator="{ props }">
            <p v-bind="props" class="tw-text-sm tw-font-medium">
              Projected Growth (%YoY)
            </p>
          </template>
          <div
            class="tw-w-52 tw-h-14 tw-p-2 tw-bg-white tw-border tw-rounded tw-border-[#D9D9D9] tw-shadow-2xl"
          >
            <p class="tw-text-sm tw-text-center">
              The % increase in demand the company expects.
            </p>
          </div>
        </v-menu>
        <div class="tw-grid tw-grid-cols-2 tw-pt-4">
          <v-menu open-on-hover location="top">
            <template v-slot:activator="{ props }">
              <div v-bind="props" class="tw-text-center">
                <p class="tw-text-2xl tw-font-semibold">
                  {{ `${lodGetNumeric(data, 'metrics.jdaGrowth')}` }}
                </p>
                <p class="tw-text-xs">Planned Internal Forecast</p>
              </div>
            </template>
            <div
              class="tw-w-80 tw-h-14 tw-p-2 tw-bg-white tw-border tw-rounded tw-border-[#D9D9D9] tw-shadow-2xl"
            >
              <p class="tw-text-sm tw-text-center">
                Internal market demands at a category level determined by
                internal historical data.
              </p>
            </div>
          </v-menu>
          <v-menu open-on-hover location="top">
            <template v-slot:activator="{ props }">
              <div v-bind="props" class="tw-text-center">
                <p class="tw-text-2xl tw-font-semibold">
                  {{ `${lodGetNumeric(data, 'metrics.marketSensingGrowth')}` }}
                </p>
                <p class="tw-text-xs">Market Sensing Model Forecast</p>
              </div>
            </template>
            <div
              class="tw-w-96 tw-h-20 tw-p-2 tw-bg-white tw-border tw-rounded tw-border-[#D9D9D9] tw-shadow-2xl"
            >
              <p class="tw-text-sm tw-text-center">
                Highly accurate market demand projections at a category level
                based on ML models that analyze and learn from internal and
                external data feeds
              </p>
            </div>
          </v-menu>
        </div>
      </div>
      <div
        class="tw-flex tw-flex-col tw-items-center tw-col-span-2"
        v-if="!isModelAccuracyHidden"
      >
        <v-menu open-on-hover location="top">
          <template v-slot:activator="{ props }">
            <p v-bind="props" class="tw-text-sm tw-font-medium tw-pb-6">
              ML Model Accuracy
            </p>
          </template>
          <div
            class="tw-w-96 tw-h-14 tw-p-2 tw-bg-white tw-border tw-rounded tw-border-[#D9D9D9] tw-shadow-2xl"
          >
            <p class="tw-text-sm tw-text-center">
              ML Model accuracy is the percentage of correctness of prediction
              by ML Model for the given dataset.
            </p>
          </div>
        </v-menu>
        <ModelAccuracyChart :modelAccuracy="lodToNumber(lodGetNumeric(data, 'modelAccuracy', false))" />
      </div>
    </div>
    <div
      class="tw-w-full tw-flex tw-justify-center tw-items-center tw-gap-3 tw-pt-2"
    >
      <v-menu open-on-hover location="top">
        <template v-slot:activator="{ props }">
          <div v-bind="props" class="tw-flex tw-flex-col tw-items-center">
            <span
              class="tw-text-4xl tw-font-semibold"
              :style="{ color: getColorCode(lodGetNumeric(data, 'metrics.variance', false)) }"
            >
              {{ `${lodGetNumeric(data, 'metrics.variance')}` }}
            </span>
            <span class="tw-text-xs">Variance</span>
          </div>
        </template>
        <div
          class="tw-w-80 tw-h-14 tw-p-2 tw-bg-white tw-border tw-rounded tw-border-[#D9D9D9] tw-shadow-2xl"
        >
          <p class="tw-text-sm tw-text-center">
            {{
              `The difference between market sensing and the internal forecast results in a ${lodGetNumeric(data, 'metrics.variance')} variance.`
            }}
          </p>
        </div>
      </v-menu>
      <div>
        <v-btn
          :prepend-icon="
            Math.abs(lodToNumber(lodGetNumeric(data, 'metrics.variance', false))) >= 20 ? 'mdi-alert-circle' : 'mdi-circle'
          "
          variant="outlined"
          :color="getColorCode(lodGetNumeric(data, 'metrics.variance', false))"
          rounded="pill"
        >
          {{ getActionButtonLabel(lodToNumber(lodGetNumeric(data, 'metrics.variance', false)))
          }}<v-icon end icon="mdi-chevron-right" />
        </v-btn>
      </div>
    </div>
  </div>
</template>
