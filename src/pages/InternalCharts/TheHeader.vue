<script>
import _ from "lodash";
import fetchInternalChartsOptions from "@/api/fetchInternalChartsOptions";

const BY_VALUE = "BY_VALUE";
const BY_QUANTITY = "BY_QUANTITY";
export const ALL_OPTION = "All";
export default {
  name: "TheHeader",
  data(){
    return {
      isByVolume: true,
      filters : {
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
        time_horizon: {
          items: [],
          selected: null,
          filterlabel: "Time Horizon"
        },
        internal_model: {
          items: [],
          selected: null,
          filterlabel: "Internal Model"
        },


        valueOrQuantity: BY_QUANTITY
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
    const options = await fetchInternalChartsOptions().catch(() => null);
    
    if (options){
      console.log(options);
      this.filters.categories.items = options.categories;
      this.filters.customers.items = options.customers;
      this.filters.time_horizon.items = options.msTimeHorizon;
      this.filters.internal_model.items = options.msModel;
    }
    // Add all option to the categories and customers filters
    this.filters.categories.items = this.filters.categories.items;
    this.filters.customers.items = this.filters.customers.items;
    this.selectFilterUpdated("categories", this.filters.categories.items[1]);
    this.selectFilterUpdated("time_horizon", this.filters.time_horizon.items[0]);
    this.selectFilterUpdated("internal_model", this.filters.internal_model.items[0]);
    this.selectFilterUpdated("customers", this.filters.customers.items[1])
  },
  emits: ['updateFilters'],
  methods: {
    selectFilterUpdated(filterName, currentSelection){
      this.filters[filterName].selected = currentSelection;
      this.filtersUpdated();
    },
    valueOrQuantityUpdate(){
      this.filters.valueOrQuantity = this.filters.valueOrQuantity === BY_VALUE ? BY_QUANTITY : BY_VALUE;
      this.isByVolume = !this.isByVolume;
      this.filtersUpdated();
    },
    filtersUpdated(){
      this.$emit("updateFilters", this.filters);
    },
  }
}
</script>

<template>
  <div class="tw-flex tw-gap-x-4 tw-w-full tw-bg-white tw-px-3">
    <div class="tw-pt-5 tw-w-1/6">
      <v-select
        label="Category"
        :items="filters.categories.items"
        :model-value="filters.categories.selected"
        @update:modelValue="value=>selectFilterUpdated('categories', value)"
      ></v-select>
    </div>
    <div class="tw-pt-5 tw-w-1/6">
      <v-select
        label="Customers"
        :items="filters.customers.items"
        :model-value="filters.customers.selected"
        @update:modelValue="value=>selectFilterUpdated('customers', value)"
      ></v-select>
    </div>
    <div class="tw-pt-5 tw-w-1/6">
      <v-select
        label="MS Time Horizon"
        :items="filters.time_horizon.items"
        :model-value="filters.time_horizon.selected"
        @update:modelValue="value=>selectFilterUpdated('time_horizon', value)"
      ></v-select>
    </div>
    <div class="tw-pt-5 tw-w-1/6">
      <v-select
        label="Internal Model"
        :items="filters.internal_model.items"
        :model-value="filters.internal_model.selected"
        @update:modelValue="value=>selectFilterUpdated('internal_model', value)"
      ></v-select>
    </div>
    <div class="tw-flex tw-items-center tw-gap-1.5">
      <p :class="`${!isByVolume ? 'tw-font-medium' : ''}`">Value (USD)</p>
      <div class="tw-flex tw-pt-5" style="color: #7823DC;">
        <v-switch inset @click="valueOrQuantityUpdate" v-model="isByVolume"></v-switch>
      </div>
      <p :class="`${isByVolume ? 'tw-font-medium' : ''}`">Volume</p>
    </div>
  </div>
</template>
