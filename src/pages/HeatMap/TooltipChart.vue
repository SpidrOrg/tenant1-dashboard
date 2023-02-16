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
        ['Time Period', 'Actual', 'Expected'],
        ['Oct 22 - Dec 22', 30, 54],
        ['Nov 22 - Jan 23', 70, 40],
        ['Dec 22 - Feb 23', 66, 20],
        ['Jan 23 - Mar 23', 10, 40],
        ['Feb 23 - Apr 23', 11, 4],
        ['Mar 23 - May 23', 60, 90],
        ['Apr 23 - Jun 23', 30, 50],
        ['May 23 - Jul 23', 10, 4],
      ],
      options: {
        title: '',
        curveType: 'none',
        legend: { position: 'top' },
        width: 600,
        height: 300,
        chartArea:{
          left:5,
          top: 20,
          width: '100%',
          height: '250',
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
