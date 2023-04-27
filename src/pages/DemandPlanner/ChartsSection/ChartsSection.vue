<script>
import _ from 'lodash';
import { FORECAST_PERIOD_TYPES } from '../constants';
import ChartKeyDemandDrivers from '@/pages/DemandPlanner/ChartsSection/ChartKeyDemandDrivers.vue';
import ChartPYandImpliedGrowth from '@/pages/DemandPlanner/ChartsSection/ChartPYAndImpliedGrowth.vue';
import ChartHistoricalAndActual from '@/pages/DemandPlanner/ChartsSection/ChartHistoricalAndActual.vue';

export default {
  name: 'ChartsSection',
  components: {
    ChartKeyDemandDrivers,
    ChartPYandImpliedGrowth,
    ChartHistoricalAndActual,
  },
  props: {
    activePeriodData: {
      type: Object,
      required: true,
    },
    options: Object,
  },
  computed: {
    metrics() {
      return this.activePeriodData.metrics;
    },
    periodLabel() {
      return _.get(this.activePeriodData, 'label');
    },
    horizon() {
      return _.get(this.activePeriodData, 'horizon');
    },
    selectedFilters() {
      return _.get(this.options, 'selectedFilters');
    },
    forecastPeriodType() {
      return _.get(this.options, 'forecastPeriodType');
    },
    formattedHorizon() {
      if (this.forecastPeriodType === FORECAST_PERIOD_TYPES.R3M_VIEW) {
        return _.get(this.activePeriodData, 'formattedHorizon');
      }
      return '';
    },
  },
};
</script>

<template>
  <div class="tw-flex tw-gap-x-4 tw-items-center tw-w-full tw-py-2">
    <p class="tw-font-medium tw-text-2xl">More details for {{ periodLabel }}</p>
    <div class="tw-bg-brand-gray-4 tw-rounded" v-if="formattedHorizon">
      <p class="tw-p-1 tw-text-sm">Future {{ formattedHorizon }} months</p>
    </div>
  </div>
  <div class="tw-py-3 tw-w-full">
    <div class="tw-grid tw-grid-cols-7 tw-gap-4" v-if="metrics">
      <div class="tw-col-span-2">
        <ChartKeyDemandDrivers
          :data="metrics.keyDemandDrivers"
          :horizon="horizon"
          :selectedFilters="selectedFilters"
        />
      </div>
      <div class="tw-col-span-1">
        <ChartPYandImpliedGrowth
          :projectedPeriod="periodLabel"
          :pyVal="metrics.pyGrowth"
          :impliedVal="metrics.impliedGrowth"
        />
      </div>
      <div class="tw-col-span-4">
        <ChartHistoricalAndActual :data="metrics.historical" />
      </div>
    </div>
  </div>
</template>
