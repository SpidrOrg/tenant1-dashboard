<script>
import _ from "lodash";
import fetchMainDashboardOptions from "@/api/fetchMainDashboardOptions";

const BY_VALUE = "BY_VALUE";
const BY_QUANTITY = "BY_QUANTITY";

export const ALL_OPTION = "All";

export default {
  name: "FilterSelection",
  data(){
    return {
      filters : {
        refreshDates: {
          items: [],
          selected: null,
        },
        categories: {
          items: [],
          selected: null,
          filterlabel: "Categories"
        },
        customers: {
          items: [],
          selected: null,
          filterlabel: "Customers"
        },
        valueOrQuantity: BY_VALUE
      },
      currency: "USD",
      dataLoaded: false,

      BY_VALUE,
      BY_QUANTITY,
      ALL_OPTION,
      includes: _.includes
    }
  },

  async created() {
    // Make API call to get available options for the filters
    const options = await fetchMainDashboardOptions().catch(() => null);
    if (options){
      this.filters.categories.items = options.categories;
      this.filters.customers.items = options.customers;
      this.filters.refreshDates.items = options.marketSensingRefreshDates;
    }

    // Add all option to the categories and customers filters
    this.filters.categories.items = _.concat(ALL_OPTION, this.filters.categories.items);
    this.filters.customers.items = _.concat(ALL_OPTION, this.filters.customers.items);

    // Set default option on filters
    // this.filters.refreshDates.selected = new Date(_.first(this.filters.refreshDates.items));
    const earliestRefreshDate = new Date(_.first(this.filters.refreshDates.items))
    this.refreshDateUpdated({
      month: earliestRefreshDate.getMonth(),
      year: earliestRefreshDate.getFullYear()
    });
    this.selectFilterUpdated("categories", ALL_OPTION);
    this.selectFilterUpdated("customers", this.filters.customers.items[1])
    this.dataLoaded = true;
  },

  emits: ['updateFilters'],

  methods: {
    selectFilterUpdated(filterName, currentSelection){
      this.filters[filterName].selected = currentSelection;
      this.filtersUpdated();
    },
    refreshDateUpdated({month, year}){
      this.filters.refreshDates.selected = {month, year}
      this.filtersUpdated();
    },
    valueOrQuantityUpdate(){
      this.filters.valueOrQuantity = this.filters.valueOrQuantity === BY_VALUE ? BY_QUANTITY : BY_VALUE;
      this.filtersUpdated();
    },
    filtersUpdated(){
      this.$emit("updateFilters", this.filters);
    },
  }
}
</script>

<template>
  <div class="tw-flex tw-gap-x-3 tw-w-full tw-bg-white tw-px-3">
    <div class="tw-pt-3 tw-min-w-[14%] tw--mb-3">
<!--      <div>Month & Year</div>-->
      <VueDatePicker v-model="filters.refreshDates.selected" month-picker @update:model-value="refreshDateUpdated">
        <template  #dp-input="{ value }">
          <v-text-field  :value="value" density="comfortable"></v-text-field>
        </template>
      </VueDatePicker>
    </div>
    <div class="tw-pt-3 tw-min-w-[14%] tw--mb-3">
      <v-select
        label="Category"
        :items="filters.categories.items"
        :model-value="filters.categories.selected"
        @update:modelValue="value=>selectFilterUpdated('categories', value)"
        density="comfortable"
      />
    </div>
    <div class="tw-pt-3 tw-min-w-[14%] tw--mb-3">
      <v-select
        label="All Customers"
        :items="filters.customers.items"
        :model-value="filters.customers.selected"
        @update:modelValue="value=>selectFilterUpdated('customers', value)"
        density="comfortable"
      />
    </div>
    <div class="tw-flex tw-gap-1.5 tw-pl-3 tw--mb-3">
      <p :class="`tw-pt-6 ${filters.valueOrQuantity === BY_VALUE ? 'tw-font-medium' : ''}`">Value {{currency}}</p>
      <div class="tw-flex tw-pt-2" style="color: #7823DC;">
        <v-switch :model="filters.valueOrQuantity" inset @click="valueOrQuantityUpdate"/>
      </div>
      <p :class="`tw-pt-6 ${filters.valueOrQuantity === BY_QUANTITY ? 'tw-font-medium' : ''}`">Volume</p>
    </div>
  </div>
</template>
