<script>
import _ from 'lodash';
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
  },
  methods: {
    getPeriodLabel() {
      const label = _.get(this.activePeriodData, 'label');
      return label === this.period ? label : `${label}, ${this.period}`;
    },
  },
  computed: {
    metrics() {
      return this.activePeriodData.metrics;
    },
    period() {
      return _.get(this.activePeriodData, 'period');
    },
  },
};
</script>

<template>
  <div class="tw-flex tw-gap-x-4 tw-items-center tw-w-full tw-py-2">
    <p class="tw-font-medium tw-text-2xl">
      More details for {{ getPeriodLabel() }}
    </p>
    <div class="tw-bg-brand-gray-4 tw-rounded">
      <p class="tw-p-1 tw-text-sm">Future {{ activePeriodData.lag }} months</p>
    </div>
  </div>
  <div class="tw-py-3 tw-w-full">
    <div class="tw-grid tw-grid-cols-7 tw-gap-4" v-if="metrics">
      <div class="tw-col-span-2">
        <ChartKeyDemandDrivers :data="metrics.keyDemandDrivers" />
      </div>
      <div class="tw-col-span-1">
        <ChartPYandImpliedGrowth
          :projectedPeriod="getPeriodLabel()"
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
