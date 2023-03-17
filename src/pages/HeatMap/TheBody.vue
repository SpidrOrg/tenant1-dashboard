<script>
import TheCard from "@/pages/HeatMap/TheCard.vue";
export default {
  name: "TheBody",
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  components: {
    TheCard
  }
}
</script>

<template>
  <div class="tw-grid tw-grid-cols-2 tw-gap-5 tw-w-full tw-h-full">
    <TheCard title="Jan 23 - Mar 23" :data="data[0]"/>
    <TheCard title="Apr 23 - Jun 23" :data="data[1]"/>
    <TheCard title="Jul 23 - Sep 23" :data="data[2]"/>
    <TheCard title="Oct 23 - Dec 23" :data="data[3]"/>
  </div>
</template>
