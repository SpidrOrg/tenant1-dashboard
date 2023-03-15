<script>
import GoogleChart from '@/components/GoogleChart';
export default {
  name: 'TooltipChart',
  components: {
    GoogleChart,
  },
  data() {
    return {
      data: [
        ['Time Period', 'Market Sensing', 'Internal', 'Sales'],
        ['Aug 22 - Oct 22', 55, 70, 40],
        ['Sep 22 - Nov 22', 13, 66, 20],
        ['Oct 22 - Dec 22', 24, 30, 54],
        ['Nov 22 - Jan 23', 55, 70, 40],
        ['Dec 22 - Feb 23', 13, 66, 20],
        ['Jan 23 - Mar 23', 24, 10, 40],
        ['Feb 23 - Apr 23', 55, 11, 4],
        ['Mar 23 - May 23', 13, 60, 90],
        ['Apr 23 - Jun 23', 24, 30, 50],
        ['May 23 - Jul 23', 13, 10, 4],
      ],
      options: {
        title: '',
        curveType: 'none',
        legend: { position: 'none' },
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
};
</script>

<template>
  <div
    class="tw-w-full tw-h-full tw-p-3 tw-bg-white tw-border-2 tw-rounded tw-border-[#D9D9D9] tw-shadow-2xl tw-z-10"
  >
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
        <v-btn variant="plain" icon="mdi-close"></v-btn>
      </div>
    </div>
    <div class="tw-w-full tw-border tw-border-solid tw-border-brand-gray-2" />
    <div class="tw-w-full tw-flex tw-justify-center tw-pt-4">
      <GoogleChart type="LineChart" :options="options" :data="data" />
    </div>
  </div>
</template>
