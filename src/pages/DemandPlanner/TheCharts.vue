<script>
import ChartKeyDemandDrivers from "@/pages/DemandPlanner/ChartKeyDemandDrivers.vue";
import ChartPYandImpliedGrowth from "@/pages/DemandPlanner/ChartPYAndImpliedGrowth.vue";
import ChartHistoricalAndActual from "@/pages/DemandPlanner/ChartHistoricalAndActual.vue";

export default {
  name: 'TheCharts',
  components: {
    ChartKeyDemandDrivers,
    ChartPYandImpliedGrowth,
    ChartHistoricalAndActual
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
    projectedPeriod: {
      type: String,
      required: true,
    },
  }
};
</script>

<template>
  <div class="tw-grid tw-grid-cols-4 tw-gap-4" v-if="data">
    <div class="tw-col-span-1">
      <ChartKeyDemandDrivers :data="data.keyDemandDrivers"/>
    </div>
    <div class="tw-col-span-1">
      <ChartPYandImpliedGrowth
        :projectedPeriod="projectedPeriod"
        :pyVal="data.pyGrowth"
        :impliedVal="data.impliedGrowth"
      />
    </div>
    <div class="tw-col-span-2">
      <ChartHistoricalAndActual :data="data.historical"/>
    </div>
  </div>
</template>
