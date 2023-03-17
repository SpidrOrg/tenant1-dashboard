<script>
import GoogleChart from '@/components/GoogleChart';
export default {
  name: "TooltipChart",
  components: {
    GoogleChart,
  },
  data(){
    return {
      data: [
        ['Time Period', 'Market Sensing', 'Internal', 'Actual' ],
        ['Aug 22 - Oct 22', 55,70, 40],
        ['Sep 22 - Nov 22', 13,66, 20],
        ['Oct 22 - Dec 22', 24,30, 54],
        ['Nov 22 - Jan 23', 55,70, 40],
        ['Dec 22 - Feb 23', 13,66, 20],
        ['Jan 23 - Mar 23', 24,10, 40],
        ['Feb 23 - Apr 23', 55,11, 4],
        ['Mar 23 - May 23', 13,60, 90],
        ['Apr 23 - Jun 23', 24,30, 50],
        ['May 23 - Jul 23', 13,10, 4],
      ],
      options: {
        title: '',
        curveType: 'none',
        legend: { position: 'top' },
        colors: ['#570EAA', '#787878', '#C8A5F0',],
        width: 750,
        height: 350,
        chartArea:{
          left: '6%',
          top: '6%',
          width: '90%',
          height: '80%',
        }
      }
    }
  }
}
</script>

<template>
  <div>
    <div class="tw-flex tw-w-full tw-h-12 tw-bg-white">
      <div class="tw-flex tw-h-full tw-items-center tw-ml-auto tw-pr-3 tw-cursor-pointer">X</div>
    </div>
    <GoogleChart type="LineChart" :options="options" :data="data"/>
  </div>
</template>
