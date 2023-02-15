<script>
import InfoIcon from "@/images/info-icon.svg"
import TheScale from "./TheScale.vue"
export default {
  name: "TheHeader",
  data(){
    return {
      InfoIcon,
      isByVolume: false
    }
  },
  components: {
    TheScale
  }
}
</script>

<template>
  <div class="tw-flex tw-items-center tw-justify-between tw-w-full tw-bg-white tw-px-3">
    <div class="tw-flex tw-justify-start tw-w-8/12 tw-gap-x-5">
      <div class="tw-w-2/6 tw-pt-5">
        <v-select
          label="2023"
          :items="['2022', '2021', '2020', '2019', '2018', '2017']"
        ></v-select>
      </div>
      <div class="tw-flex tw-items-center tw-gap-1.5">
        <p :class="`${!isByVolume ? 'tw-font-medium' : ''}`">Value (USD)</p>
        <div class="tw-flex tw-pt-5">
          <v-switch color="purple-accent-2" label="Volume" inset @click="isByVolume = !isByVolume"></v-switch>
          </div>
      </div>
    </div>
    <div class="tw-flex tw-justify-between tw-w-6/12">
      <div class="tw-flex tw-items-center tw-gap-1">
        <img :src="InfoIcon" class="tw-h-6 tw-m-2"/>
        <p>Abs value scale:</p>
      </div>
      <div class="tw-w-8/12">
        <TheScale />
      </div>
    </div>
  </div>
</template>
