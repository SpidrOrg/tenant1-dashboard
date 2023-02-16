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
        title: 'Performance',
        curveType: 'none',
        legend: { position: 'top' },
        colors: ['#570EAA', '#787878', '#C8A5F0',],
        width: 600,
        height: 300,
      }
    }
  }
}
</script>

<template>
  <GoogleChart type="LineChart" :options="options" :data="data"/>
</template>
