<script>
import _ from 'lodash';
import fetchDashboardOptions from '@/api/fetchDashboardOptions';

const BY_VALUE = 'BY_VALUE';
const BY_QUANTITY = 'BY_QUANTITY';
export const ALL_OPTION = 'All';

export default {
  name: 'FiltersSection',
  props: {
    filtersDisabled: { type: Boolean, default: false },
    uiConfig: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      filters: {
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
        time_horizon: {
          items: [],
          selected: null,
          filterlabel: 'Time Horizon',
        },
        internal_model: {
          items: [],
          selected: null,
          filterlabel: 'Internal Model',
        },
        refreshDate: null,
        valueOrQuantity: BY_QUANTITY,
      },

      currency: 'USD',
      BY_VALUE,
      BY_QUANTITY,
      ALL_OPTION,
    };
  },
  async created() {
    const options = await fetchDashboardOptions().catch(() => null);

    if (options) {
      const msPivots = _.reduce(_.split(_.get(options, `ms.pivots`), "%^"), (acc, v) => {
        const [splitName, splitItems] = _.split(v, "&^");
        acc[splitName] = splitItems;
        return acc;
      }, {});
      const split0Config = _.get(this.uiConfig, "config.splits[0]");

      this.filters.categories.items = options.ms.categories;
      this.filters.customers.items = _.split(_.get(msPivots, `${_.get(split0Config, 'dataName')}`), '___');
      // Add all option to the customers filters
      this.filters.customers.items = _.concat(
        ALL_OPTION,
        this.filters.customers.items
      );
      this.filters.time_horizon.items = options.ms.msTimeHorizon;
      this.filters.internal_model.items = options.clientData.models;
    }
    this.filters.refreshDate = options.updateDates[0];

    this.selectFilterUpdated('categories', this.filters.categories.items[0]);
    this.selectFilterUpdated(
      'time_horizon',
      this.filters.time_horizon.items[0]
    );
    this.selectFilterUpdated(
      'internal_model',
      this.filters.internal_model.items[0]
    );
    this.selectFilterUpdated('customers', this.filters.customers.items[0]);
  },
  emits: ['updateFilters'],
  methods: {
    selectFilterUpdated(filterName, currentSelection) {
      this.filters[filterName].selected = currentSelection;
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
      <label for="category" class="tw-text-sm">Category</label>
      <v-select
        :disabled="filtersDisabled"
        :items="filters.categories.items"
        :model-value="filters.categories.selected"
        @update:modelValue="(value) => selectFilterUpdated('categories', value)"
        density="comfortable"
      ></v-select>
    </div>
    <div class="tw-pt-3 tw-min-w-[14%] tw--mb-3">
      <label for="customer" class="tw-text-sm">Channel(s)</label>
      <v-select
        :disabled="filtersDisabled"
        :items="filters.customers.items"
        :model-value="filters.customers.selected"
        @update:modelValue="(value) => selectFilterUpdated('customers', value)"
        density="comfortable"
      ></v-select>
    </div>
    <div class="tw-pt-3 tw-min-w-[14%] tw--mb-3">
      <label for="mstimehorizon" class="tw-text-sm">MS Time Horizon</label>
      <v-select
        :disabled="filtersDisabled"
        :items="filters.time_horizon.items"
        :model-value="filters.time_horizon.selected"
        @update:modelValue="
          (value) => selectFilterUpdated('time_horizon', value)
        "
        density="comfortable"
      ></v-select>
    </div>
    <div class="tw-pt-3 tw-min-w-[14%] tw--mb-3">
      <label for="model" class="tw-text-sm">Model</label>
      <v-select
        :disabled="filtersDisabled"
        :items="filters.internal_model.items"
        :model-value="filters.internal_model.selected"
        @update:modelValue="
          (value) => selectFilterUpdated('internal_model', value)
        "
        density="comfortable"
      ></v-select>
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
          :disabled="filtersDisabled"
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
