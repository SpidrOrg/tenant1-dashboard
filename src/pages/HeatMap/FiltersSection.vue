<script>
import _ from 'lodash';
import { format as formatFn, parse, endOfMonth } from 'date-fns';
import fetchDashboardOptions from '@/api/fetchDashboardOptions';

import InfoIcon from '@/images/info-icon.svg';
import HeatMapScaleIcon from '@/images/heatmap-scale.svg';

export const BY_VALUE = 'BY_VALUE';
export const BY_QUANTITY = 'BY_QUANTITY';

export default {
  name: 'FiltersSection',
  props: {
    isDataLoading: { type: Boolean, default: false },
  },
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
    let earliestRefreshDate = null;
    if (_.first(this.filters.refreshDates.items)) {
      earliestRefreshDate = parse(
        _.first(this.filters.refreshDates.items),
        'yyyy-MM-dd',
        new Date()
      );
    }

    if (earliestRefreshDate !== null) {
      this.updateLatestRefreshDate(earliestRefreshDate);
      this.refreshDateUpdated(
        {
          month: earliestRefreshDate.getMonth(),
          year: earliestRefreshDate.getFullYear(),
        },
        true
      );
    } else {
      this.filterUpdatedInstant();
    }

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
      return endOfMonth(
        parse(
          _.first(this.filters.refreshDates.items),
          'yyyy-MM-dd',
          new Date()
        )
      );
    },
    updateLatestRefreshDate(dateObj) {
      this.$emit('latestRefreshDateUpdate', dateObj);
    },
    refreshDateUpdated({ month, year }, isInstant = false) {
      this.filters.refreshDates.selected = { month, year };
      isInstant ? this.filterUpdatedInstant() : this.filtersUpdated();
    },
    valueOrQuantityUpdate(event, isInstant = false) {
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
        :disabled="isDataLoading || filters.refreshDates.selected === null"
        auto-apply
        menu-class-name="dp-custom-menu"
      >
        <template #dp-input="{ value }">
          <div
            :class="`tw-flex tw-items-center tw-justify-between tw-py-2 tw-px-3 tw-bg-brand-gray-1
            ${isDataLoading ? 'tw-opacity-40' : 'tw-cursor-pointer'}`"
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
        :class="`tw-pt-10 desktop:tw-text-sm ${
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
          :disabled="isDataLoading"
        />
      </div>
      <span
        :class="`tw-pt-10 desktop:tw-text-sm ${
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
              Value = Market Sensing - Internal Prediction<br />- = Internal
              higher than Market<br />+ = Market Higher than Internal
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
.dp-custom-menu {
  background: #ffffff;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2);
  padding: 8px;
}
.dp__theme_light {
  --dp-background-color: #ffffff;
  --dp-text-color: #212121;
  --dp-hover-color: #f3f3f3;
  --dp-hover-text-color: #212121;
  --dp-hover-icon-color: #959595;
  --dp-primary-color: #7823dc;
  --dp-primary-disabled-color: rgb(120 35 220 / 30%);
  --dp-primary-text-color: #ffffff;
  --dp-secondary-color: #c0c4cc;
  --dp-border-color: #ddd;
  --dp-menu-border-color: #ddd;
  --dp-border-color-hover: #aaaeb7;
  --dp-disabled-color: #f6f6f6;
  --dp-scroll-bar-background: #f3f3f3;
  --dp-scroll-bar-color: #959595;
  --dp-success-color: #76d275;
  --dp-success-color-disabled: #a3d9b1;
  --dp-icon-color: #959595;
  --dp-danger-color: #ff6f60;
  --dp-highlight-color: rgba(25, 118, 210, 0.1);
}
</style>
