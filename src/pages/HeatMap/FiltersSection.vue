<script>
import InfoIcon from '@/images/info-icon.svg';
import HeatMapScaleIcon from '@/images/heatmap-scale.svg';
export default {
  name: 'FiltersSection',
  data() {
    return {
      InfoIcon,
      HeatMapScaleIcon,
      isByVolume: false,
      selectedDate: new Date().toLocaleDateString('en-us', {
        year: 'numeric',
        month: 'numeric',
      }),
    };
  },
};
</script>

<template>
  <div class="tw-flex tw-gap-x-3 tw-w-full tw-bg-white tw-px-3">
    <div class="tw-pt-3 tw-min-w-[14%] tw--mb-3">
      <VueDatePicker v-model="selectedDate" month-picker>
        <template #dp-input="{ value }">
          <v-text-field :value="value" density="comfortable"></v-text-field>
        </template>
      </VueDatePicker>
    </div>
    <div class="tw-flex tw-gap-1.5 tw-pl-3 tw--mb-3">
      <span :class="`tw-pt-6 ${!isByVolume ? 'tw-font-medium' : ''}`">
        Value (USD)
      </span>
      <div class="tw-flex tw-pt-2" style="color: #7823dc">
        <v-switch
          :model-value="isByVolume"
          inset
          @click="filtersUpdateHandler('isByVolume', !isByVolume)"
        />
      </div>
      <span :class="`tw-pt-6 ${isByVolume ? 'tw-font-medium' : ''}`">
        Volume
      </span>
    </div>
    <div class="tw-flex tw-justify-end tw-ml-auto">
      <div class="tw-flex tw-gap-1 tw-pt-4 tw-pr-3">
        <img :src="InfoIcon" class="tw-h-6 tw-m-2" />
        <p class="tw-pt-2">Abs value scale:</p>
      </div>
      <div class="tw-w-8/12">
        <img :src="HeatMapScaleIcon" class="tw-h-full" />
      </div>
    </div>
  </div>
</template>
