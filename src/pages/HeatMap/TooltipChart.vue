<script>
import GoogleChart from '@/components/GoogleChart';
import fetchDemandForecastData from '@/api/fetchDemandForecastData';

export default {
  name: 'TooltipChart',
  props: {
    category: { type: String, required: true },
    customer: { type: String, required: true },
    period: { type: String, required: true }
  },
  components: {
    GoogleChart,
  },
  data() {
    return {
      apiData: [],
      isLoading: true,
      error: null,
      options: {
        title: '',
        curveType: 'none',
        legend: { position: 'none' },
        tooltip: { trigger: 'none' },
        colors: ['#570EAA', '#787878', '#C8A5F0'],
        width: 800,
        height: 350,
        hAxis: {
          textStyle: {
            color: '#323232',
            fontName: 'Graphik',
            fontSize: 12,
          },
        },
        chartArea: {
          left: '4%',
          top: '4%',
          width: '100%',
          height: '84%',
        },
        series: {
          1: { lineDashStyle: [6, 6] },
        },
      },
    };
  },
  async created() {
    this.isLoading = true;
    try {
      this.apiData = await fetchDemandForecastData({
        category: this.category,
        customer: this.customer,
        period: this.period,
      });
    } catch (e) {
      this.error = e;
    }
    this.isLoading = false;
  },
  methods:{
    clickClose() {
      this.$emit('closeEvent');
    }
  }
};
</script>

<template>
  <div
    class="tw-w-full tw-h-full tw-p-3 tw-bg-white tw-border-2 tw-rounded tw-border-[#D9D9D9] tw-shadow-2xl tw-z-10"
  >
    <div
      class="tw-w-60 tw-h-60 tw-flex tw-justify-center tw-items-center"
      v-if="isLoading"
    >
      <v-progress-circular
        indeterminate
        color="#7823DC"
        :size="60"
        :width="10"
      />
    </div>
    <div v-if="!isLoading && apiData.length > 0">
      <div class="tw-flex tw-items-center tw-w-full">
        <h1 class="tw-text-xl tw-font-medium">
          Demand Forecast : Category / Customer
        </h1>
        <div class="tw-flex tw-items-center tw-pl-10">
          <div class="tw-flex tw-items-center tw-gap-x-1 tw-pl-3">
            <span style="height: 12px; width: 12px; background: #570eaa" />
            <span class="tw-text-xs">Market Sensing Forecast</span>
          </div>
          <div class="tw-flex tw-items-center tw-gap-x-1 tw-pl-3">
            <span style="height: 12px; width: 12px; background: #787878" />
            <span class="tw-text-xs">Internal Forecast</span>
          </div>
          <div class="tw-flex tw-items-center tw-gap-x-1 tw-pl-3">
            <span style="height: 12px; width: 12px; background: #c8a5f0" />
            <span class="tw-text-xs">Sales</span>
          </div>
          <v-btn variant="plain" icon="mdi-close" @click="clickClose"></v-btn>
        </div>
      </div>
      <div class="tw-w-full tw-border tw-border-solid tw-border-brand-gray-2" />
      <div class="tw-w-full tw-flex tw-justify-center tw-pt-4">
        <GoogleChart type="LineChart" :options="options" :data="apiData" />
      </div>
    </div>
    <div v-if="!isLoading && error">
      <v-alert type="error" :text="error.toString()"></v-alert>
    </div>
  </div>
</template>
