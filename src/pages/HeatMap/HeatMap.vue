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
  <div class="tw-h-full tw-px-4 tw-pt-2 tw-pb-10 tw-bg-brand-gray-1">
    <div class="tw-flex tw-w-full tw-h-8 tw-bg-brand-gray-1">
    <div class="tw-flex tw-h-full tw-items-center tw-font-bold tw-text-lg">
      Heat-map View
    </div>
    <div class="tw-ml-auto tw-h-full tw-flex tw-items-center">
      Last refreshed on 01 Jan 2023
    </div>
  </div>
    <div class="tw-flex tw-w-full tw-flex-auto tw-border-t tw-border-solid tw-border-brand-gray-2" />
    <div class="tw-py-5 tw-bg-brand-gray-1">
    <TheHeader />
  </div>
    <div class="tw-w-full tw-h-5/6 tw-bg-brand-gray-1">
    <TheBody :data="HEAT_MAP_DATA"/>
  </div>
  </div>
</template>
