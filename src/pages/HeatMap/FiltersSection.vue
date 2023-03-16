<script>
import _ from 'lodash';
import fetchHeatMapOptions from '@/api/fetchHeatMapOptions';

import InfoIcon from '@/images/info-icon.svg';
import HeatMapScaleIcon from '@/images/heatmap-scale.svg';

const BY_VALUE = 'BY_VALUE';
const BY_QUANTITY = 'BY_QUANTITY';

export default {
  name: 'FiltersSection',
  data() {
    return {
      filters: {
        refreshDates: {
          items: [],
          selected: null,
        },
        valueOrQuantity: BY_VALUE,
      },
      dataLoaded: false,
      currency: 'USD',
      BY_VALUE,
      BY_QUANTITY,
      InfoIcon,
      HeatMapScaleIcon,
    };
  },
  async created() {
    // Make API call to get available options for the filters
    const options = await fetchHeatMapOptions().catch(() => null);
    if (options) {
      this.filters.refreshDates.items = options.marketSensingRefreshDates;
    }

    // Set default option on filters
    // this.filters.refreshDates.selected = new Date(_.first(this.filters.refreshDates.items));
    const earliestRefreshDate = new Date(
      _.first(this.filters.refreshDates.items)
    );
    this.refreshDateUpdated({
      month: earliestRefreshDate.getMonth(),
      year: earliestRefreshDate.getFullYear(),
    });
    this.dataLoaded = true;
  },

  emits: ['updateFilters'],

  methods: {
    refreshDateUpdated({ month, year }) {
      this.filters.refreshDates.selected = { month, year };
      this.filtersUpdated();
    },
    valueOrQuantityUpdate() {
      this.filters.valueOrQuantity =
        this.filters.valueOrQuantity === BY_VALUE ? BY_QUANTITY : BY_VALUE;
      this.filtersUpdated();
    },
    filtersUpdated() {
      this.$emit('updateFilters', this.filters);
    },
  },
};
</script>

<template>
  <div class="tw-flex tw-gap-x-3 tw-w-full tw-bg-white tw-px-3">
    <div class="tw-pt-3 tw-min-w-[14%] tw--mb-3">
      <VueDatePicker
        v-model="filters.refreshDates.selected"
        month-picker
        @update:model-value="refreshDateUpdated"
      >
        <template #dp-input="{ value }">
          <v-text-field :value="value" density="comfortable"></v-text-field>
        </template>
      </VueDatePicker>
    </div>
    <div class="tw-flex tw-gap-1.5 tw-pl-3 tw--mb-3">
      <span
        :class="`tw-pt-6 ${
          filters.valueOrQuantity === BY_VALUE ? 'tw-font-medium' : ''
        }`"
      >
        Value {{ currency }}
      </span>
      <div class="tw-flex tw-pt-2" style="color: #7823dc">
        <v-switch
          :model="filters.valueOrQuantity"
          inset
          @click="valueOrQuantityUpdate"
        />
      </div>
      <span
        :class="`tw-pt-6 ${
          filters.valueOrQuantity === BY_QUANTITY ? 'tw-font-medium' : ''
        }`"
      >
        Volume
      </span>
    </div>
    <div class="tw-flex tw-justify-end tw-ml-auto">
      <div class="tw-flex tw-gap-1 tw-pt-4 tw-pr-3">
        <v-menu open-on-hover location="top">
          <template v-slot:activator="{ props }">
            <img v-bind="props" :src="InfoIcon" class="tw-h-6 tw-m-2" />
          </template>
          <div
            class="tw-w-80 tw-h-20 tw-p-2 tw-bg-white tw-border tw-rounded tw-border-[#D9D9D9] tw-shadow-2xl"
          >
            <p class="tw-text-sm tw-text-center">
              Value = Market Sensing - Internal Prediction - = Internal higher
              than Market + = Market Higher than Internal
            </p>
          </div>
        </v-menu>
        <p class="tw-pt-2">Abs value scale:</p>
      </div>
      <div class="tw-w-8/12">
        <img :src="HeatMapScaleIcon" class="tw-h-full" />
      </div>
    </div>
  </div>
</template>

<style>
.dp__clear_icon {
  position: absolute;
  top: 36%;
  right: 0;
  transform: translateY(-50%);
  cursor: pointer;
  color: var(--dp-icon-color);
}
</style>
