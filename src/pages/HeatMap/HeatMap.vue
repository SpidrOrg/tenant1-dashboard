<script>
import TheHeader from '@/pages/HeatMap/TheHeader.vue'
import TheBody from "@/pages/HeatMap/TheBody.vue";
import HEAT_MAP_DATA from './constants'
export default {
  name: "HeatMap",
  components: {
    TheHeader,
    TheBody
  },
  data() {
    return {
      HEAT_MAP_DATA
    }
  }
}
</script>

<template>
  <div class="tw-flex tw-w-full tw-h-8 tw-bg-brand-gray-1">
    <div class="tw-flex tw-h-full tw-items-center tw-font-bold">
      Heat-map View
    </div>
    <div class="tw-ml-auto tw-h-full tw-flex tw-items-center">
      Last refreshed on {{new Date().toLocaleString('en-GB',{
      year: "numeric",
      month: "long",
      day: "numeric",
    })}}
    </div>
  </div>
  <div class="tw-flex tw-w-full tw-flex-auto tw-border-t tw-border-solid tw-border-brand-gray-2" />
  <div class="tw-flex tw-flex-col tw-h-full tw-py-4 tw-gap-4 tw-bg-brand-gray-1">
    <TheHeader />
    <TheBody :data="HEAT_MAP_DATA"/>
  </div>
</template>
