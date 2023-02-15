<script>
import TheCard from "@/components/HeatMap/TheCard.vue";
export default {
  name: "TheBody",
  components: {
    TheCard
  }
}
</script>

<template>
  <div class="tw-grid tw-grid-cols-2 tw-gap-4 tw-w-full tw-h-full">
    <TheCard title="Jan 23 - Mar 23"/>
    <TheCard title="Apr 23 - Jun 23"/>
    <TheCard title="Jul 23 - Sep 23"/>
    <TheCard title="Oct 23 - Dec 23"/>
  </div>
</template>
