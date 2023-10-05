<script>
import _ from 'lodash';
import { format as formatFn, parse, endOfMonth } from 'date-fns';
import fetchDashboardOptions from '@/api/fetchDashboardOptions';

const BY_VALUE = 'BY_VALUE';
const BY_QUANTITY = 'BY_QUANTITY';

export const ALL_OPTION = 'All';

export default {
  name: 'FilterSelection',
  props: {
    isDataLoading: { type: Boolean, default: false },
    pageConfig: {
      type: Object,
      required: false
    },
  },
  data() {
    return {
      filters: {
        refreshDates: {
          items: [],
          selected: null,
        },
        categories: {
          items: [],
          selected: null,
          filterlabel: _.get(this.pageConfig, 'pageConfiguration.filters.category.label'),
        },
        customers: {
          items: [],
          selected: null,
          filterlabel: _.get(this.pageConfig, 'pageConfiguration.filters.split1.label'),
        },
        valueOrQuantity: BY_QUANTITY,
      },
      currency: 'USD',
      dataLoaded: false,

      BY_VALUE,
      BY_QUANTITY,
      ALL_OPTION,
      includes: _.includes,
    };
  },

  async created() {
    // Make API call to get available options for the filters
    const options = await fetchDashboardOptions().catch(() => null);
    if (options) {
      this.filters.categories.items = _.get(options, 'ms.categories');
      this.filters.customers.items = _.get(options, 'ms.customers');
      this.filters.refreshDates.items = _.get(options, 'updateDates');
    }

    // Add all option to the customers filters
    this.filters.customers.items = _.concat(
      ALL_OPTION,
      this.filters.customers.items
    );

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
    }

    this.selectFilterUpdated(
      'categories',
      this.filters.categories.items[0],
      true
    );
    this.selectFilterUpdated(
      'customers',
      this.filters.customers.items[0],
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
    selectFilterUpdated(filterName, currentSelection, isInstant = false) {
      this.filters[filterName].selected = currentSelection;
      isInstant ? this.filterUpdatedInstant() : this.filtersUpdated();
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
      this.$emit('updateFilters', this.filters);
    },
    filterUpdatedInstant() {
      this.$emit('updateFiltersInstant', this.filters);
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
    <div class="tw-pt-3 tw-min-w-[14%] tw--mb-3">
      <label for="category" class="tw-text-sm">{{ filters.categories.filterlabel }}</label>
      <v-select
        id="category"
        :items="filters.categories.items"
        :model-value="filters.categories.selected"
        @update:modelValue="(value) => selectFilterUpdated('categories', value)"
        density="comfortable"
        :disabled="isDataLoading"
      />
    </div>
    <div class="tw-pt-3 tw-min-w-[14%] tw--mb-3">
      <label for="customers" class="tw-text-sm">{{ filters.customers.filterlabel }}</label>
      <v-select
        id="customers"
        :items="filters.customers.items"
        :model-value="filters.customers.selected"
        @update:modelValue="(value) => selectFilterUpdated('customers', value)"
        density="comfortable"
        :disabled="isDataLoading"
      />
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
          :disabled="isDataLoading"
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
