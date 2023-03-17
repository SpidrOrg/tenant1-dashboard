<script>
import InfoIcon from "@/images/info-icon.svg"
import HeatMapScaleIcon from '@/images/heatmap-scale.svg'
export default {
  name: "TheHeader",
  data(){
    return {
      InfoIcon,
      HeatMapScaleIcon,
      isByVolume: false,
      selectedYear: '2023'
    }
  },
}
</script>

<template>
  <div class="tw-flex tw-justify-between tw-w-full tw-bg-white tw-px-3">
    <div class="tw-flex tw-justify-start tw-w-7/12 tw-gap-x-3">
      <div class="tw-w-2/6 tw-pt-3 tw--mb-3">
        <v-select
          v-model="selectedYear"
          :label="selectedYear"
          :items="['2023', '2022', '2021', '2020', '2019', '2018']"
          single-line
          density="comfortable"
        ></v-select>
      </div>
      <div class="tw-flex tw-gap-1.5 tw-pl-6 tw--mb-3">
        <p :class="`tw-pt-6 ${!isByVolume ? 'tw-font-medium' : ''}`">Value (USD)</p>
        <div class="tw-flex tw-pt-2" style="color: #7823DC;">
          <v-switch inset @click="isByVolume = !isByVolume"></v-switch>
        </div>
        <p :class="`tw-pt-6 ${isByVolume ? 'tw-font-medium' : ''}`">Volume</p>
      </div>
    </div>
    <div class="tw-flex tw-justify-end tw-w-7/12">
      <div class="tw-flex tw-gap-1 tw-pt-4 tw-pr-3">
        <img :src="InfoIcon" class="tw-h-6 tw-m-2"/>
        <p class="tw-pt-2">Abs value scale:</p>
      </div>
      <div class="tw-w-8/12">
        <img :src="HeatMapScaleIcon" class="tw-h-full"/>
      </div>
    </div>
  </div>
</template>
