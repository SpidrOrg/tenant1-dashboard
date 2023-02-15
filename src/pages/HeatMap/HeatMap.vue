<script>
import TheHeader from '@/components/HeatMap/TheHeader.vue'
import TheBody from "@/components/HeatMap/TheBody.vue";
export default {
  name: "HeatMap",
  components: {
    TheHeader,
    TheBody
  }
}
</script>

<template>
  <div class="tw-flex tw-w-full tw-h-8 tw-bg-brand-gray-1">
    <div class="tw-flex tw-h-full tw-items-center tw-font-bold">
      Heat-map View
    </div>
    <div class="tw-ml-auto tw-h-full tw-flex tw-items-center">
      Last refreshed on
    </div>
  </div>
  <div class="tw-flex tw-w-full tw-flex-auto tw-border-t tw-border-solid tw-border-brand-gray-2" />
  <div class="tw-flex tw-flex-col tw-h-full tw-py-4 tw-gap-4 tw-bg-brand-gray-1">
    <TheHeader />
    <TheBody />
  </div>
</template>
