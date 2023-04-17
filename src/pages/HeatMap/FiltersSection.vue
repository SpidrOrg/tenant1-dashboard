<script>
import _ from 'lodash';
import { format as formatFn, parse } from 'date-fns';
import fetchDashboardOptions from '@/api/fetchDashboardOptions';

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
        valueOrQuantity: BY_QUANTITY,
      },
      customers: [],
      categories: [],
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
    const options = await fetchDashboardOptions().catch(() => null);
    if (options) {
      this.filters.refreshDates.items = _.get(options, 'updateDates');
      this.customers = _.get(options, 'ms.customers', []);
      this.categories = _.get(options, 'ms.categories', []);
    }

    // Set default option on filters
    // this.filters.refreshDates.selected = new Date(_.first(this.filters.refreshDates.items));
    const earliestRefreshDate = parse(
      _.first(this.filters.refreshDates.items),
      'yyyy-MM-dd',
      new Date()
    );
    this.updateLatestRefreshDate(earliestRefreshDate);
    this.refreshDateUpdated(
      {
        month: earliestRefreshDate.getMonth(),
        year: earliestRefreshDate.getFullYear(),
      },
      true
    );
    this.dataLoaded = true;
  },

  emits: ['updateFilters', 'updateFiltersInstant', 'latestRefreshDateUpdate'],

  methods: {
    formatDatePickerValue(date) {
      return formatFn(date, 'MMM yyyy');
    },
    getMinDate() {
      return parse(
        _.last(this.filters.refreshDates.items),
        'yyyy-MM-dd',
        new Date()
      );
    },
    getMaxDate() {
      return parse(
        _.first(this.filters.refreshDates.items),
        'yyyy-MM-dd',
        new Date()
      );
    },
    updateLatestRefreshDate(dateObj) {
      this.$emit('latestRefreshDateUpdate', dateObj);
    },
    refreshDateUpdated({ month, year }, isInstant = false) {
      this.filters.refreshDates.selected = { month, year };
      isInstant ? this.filterUpdatedInstant() : this.filtersUpdated();
    },
    valueOrQuantityUpdate(isInstant = false) {
      this.filters.valueOrQuantity =
        this.filters.valueOrQuantity === BY_VALUE ? BY_QUANTITY : BY_VALUE;
      isInstant ? this.filterUpdatedInstant() : this.filtersUpdated();
    },
    filtersUpdated() {
      this.$emit('updateFilters', this.filters, {
        customers: this.customers,
        categories: this.categories,
      });
    },
    filterUpdatedInstant() {
      this.$emit('updateFiltersInstant', this.filters, {
        customers: this.customers,
        categories: this.categories,
      });
    },
  },
};
</script>

<template>
  <div class="tw-flex tw-gap-x-3 tw-w-full tw-bg-white tw-px-3">
    <div class="tw-pt-3 tw-min-w-[14%] tw--mb-3">
      <label for="date-picker" class="tw-text-sm">Month & Year</label>
      <VueDatePicker
        id="date-picker"
        v-model="filters.refreshDates.selected"
        month-picker
        @update:model-value="refreshDateUpdated"
        :format="formatDatePickerValue"
        :min-date="getMinDate()"
        :max-date="getMaxDate()"
        :clearable="false"
      >
        <template #dp-input="{ value }">
          <div
            class="tw-flex tw-items-center tw-justify-between tw-py-2 tw-px-3 tw-bg-brand-gray-1 tw-cursor-pointer"
          >
            <span class="tw-text-base">{{ value }}</span>
            <v-icon
              icon="mdi-calendar-month"
              class="tw-text-brand-primary"
              :size="32"
            />
          </div>
        </template>
      </VueDatePicker>
    </div>
    <div class="tw-flex tw-gap-1.5 tw-pt-3 tw-pl-3 tw--mb-3">
      <span
        :class="`tw-pt-10 ${
          filters.valueOrQuantity === BY_VALUE ? 'tw-font-medium' : ''
        }`"
      >
        Value ({{ currency }})
      </span>
      <div class="tw-flex tw-pt-8 tw-text-brand-primary">
        <v-switch
          :model-value="filters.valueOrQuantity === BY_QUANTITY"
          inset
          density="compact"
          @click="valueOrQuantityUpdate"
        />
      </div>
      <span
        :class="`tw-pt-10 ${
          filters.valueOrQuantity === BY_QUANTITY ? 'tw-font-medium' : ''
        }`"
      >
        Volume
      </span>
    </div>
    <div class="tw-flex tw-justify-end tw-items-end tw-ml-auto tw-py-2">
      <div class="tw-flex tw-gap-1">
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
        <span class="tw-flex tw-items-center">Abs value scale:</span>
      </div>
      <div class="tw-w-8/12 tw-pb-2 tw-pl-3">
        <img :src="HeatMapScaleIcon" class="tw-h-full" />
      </div>
    </div>
  </div>
</template>

<style>
.dp__clear_icon {
  position: absolute;
  top: 36%;
  right: 4%;
  transform: translateY(-50%);
}
</style>
