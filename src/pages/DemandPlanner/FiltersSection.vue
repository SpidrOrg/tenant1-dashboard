<script>
import _ from 'lodash';
import fetchMainDashboardOptions from '@/api/DemandPlanner/fetchMainDashboardOptions';

const BY_VALUE = 'BY_VALUE';
const BY_QUANTITY = 'BY_QUANTITY';

export const ALL_OPTION = 'All';

export default {
  name: 'FilterSelection',
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
          filterlabel: 'Categories',
        },
        customers: {
          items: [],
          selected: null,
          filterlabel: 'Customers',
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
    const options = await fetchMainDashboardOptions().catch(() => null);
    if (options) {
      this.filters.categories.items = options.categories;
      this.filters.customers.items = options.customers;
      this.filters.refreshDates.items = options.marketSensingRefreshDates;
    }

    // Add all option to the customers filters
    this.filters.customers.items = _.concat(
      ALL_OPTION,
      this.filters.customers.items
    );

    // Set default option on filters
    // this.filters.refreshDates.selected = new Date(_.first(this.filters.refreshDates.items));
    const earliestRefreshDate = new Date(
      _.first(this.filters.refreshDates.items)
    );
    this.updateLatestRefreshDate(earliestRefreshDate);
    this.refreshDateUpdated(
      {
        month: earliestRefreshDate.getMonth(),
        year: earliestRefreshDate.getFullYear(),
      },
      true
    );
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
    valueOrQuantityUpdate(isInstant = false) {
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
      >
        <template #dp-input="{ value }">
          <v-text-field
            :value="value"
            density="comfortable"
            append-inner-icon="mdi-calendar-month"
          ></v-text-field>
        </template>
      </VueDatePicker>
    </div>
    <div class="tw-pt-3 tw-min-w-[14%] tw--mb-3">
      <label for="category" class="tw-text-sm">Category</label>
      <v-select
        id="category"
        :items="filters.categories.items"
        :model-value="filters.categories.selected"
        @update:modelValue="(value) => selectFilterUpdated('categories', value)"
        density="comfortable"
      />
    </div>
    <div class="tw-pt-3 tw-min-w-[14%] tw--mb-3">
      <label for="customers" class="tw-text-sm">Customer(s)</label>
      <v-select
        id="customers"
        :items="filters.customers.items"
        :model-value="filters.customers.selected"
        @update:modelValue="(value) => selectFilterUpdated('customers', value)"
        density="comfortable"
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
.dp__clear_icon {
  position: absolute;
  top: 36%;
  right: 0;
  transform: translateY(-50%);
  cursor: pointer;
  color: var(--dp-icon-color);
}
</style>
