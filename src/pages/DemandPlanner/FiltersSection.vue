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
          selected: [],
          filterlabel: "Categories"
        },
        customers: {
          items: [],
          selected: [],
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
    this.selectFilterUpdated("categories", [ALL_OPTION]);
    this.selectFilterUpdated("customers", [this.filters.customers.items[1]])
    this.dataLoaded = true;
  },

  emits: ['updateFilters'],

  methods: {
    selectFilterUpdated(filterName, currentSelection){
      const previousSelection = this.filters[filterName].selected;

      const isSelectedAllThisTime = _.includes(currentSelection, ALL_OPTION)
        && !_.includes(previousSelection, ALL_OPTION);

      const isSelectedAllRemovedThisTime = _.includes(previousSelection, ALL_OPTION)
        && !_.includes(currentSelection, ALL_OPTION);

      if (isSelectedAllThisTime){
        this.filters[filterName].selected = this.filters[filterName].items
      } else if (isSelectedAllRemovedThisTime){
        this.filters[filterName].selected = []
      } else {
        this.filters[filterName].selected = currentSelection;
        this.filters[filterName].selected = _.remove(this.filters[filterName].selected, v => {
          return v !== ALL_OPTION;
        })
      }

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
      <div>Month & Year</div>
      <VueDatePicker v-model="filters.refreshDates.selected" month-picker @update:model-value="refreshDateUpdated">
        <template  #dp-input="{ value }">
          <v-text-field  :value="value" density="comfortable"></v-text-field>
        </template>
      </VueDatePicker>
    </div>
    <div class="tw-pt-3 tw-min-w-[14%] tw--mb-3">
      <div>{{filters.categories.filterlabel}}</div>
      <v-select
        :items="filters.categories.items"
        :model-value="filters.categories.selected"
        @update:modelValue="selection=>selectFilterUpdated('categories', selection)"
        multiple
        density="comfortable"
      >
        <template v-slot:selection="{ item, index }">
          <div v-if="includes(filters.categories.selected, ALL_OPTION)">
            <v-chip v-if="index === 0">
              <span>{{ ALL_OPTION }}</span>
            </v-chip>
          </div>
          <div v-else>
            <v-chip v-if="index < 2">
              <span>{{ item.title }}</span>
            </v-chip>
            <span
              v-if="index === 2"
              class="text-grey text-caption align-self-center"
            >
          (+{{ filters.categories.selected.length - 2 }} others)
        </span>
          </div>

        </template>
      </v-select>
    </div>
    <div class="tw-pt-3 tw-min-w-[14%] tw--mb-3">
      <div>{{filters.customers.filterlabel}}</div>
      <v-select
        :items="filters.customers.items"
        :model-value="filters.customers.selected"
        @update:modelValue="selection=>selectFilterUpdated('customers', selection)"
        multiple
        density="comfortable"
      >
        <template v-slot:selection="{ item, index }">
          <div v-if="includes(filters.customers.selected, ALL_OPTION)">
            <v-chip v-if="index === 0">
              <span>{{ ALL_OPTION }}</span>
            </v-chip>
          </div>
          <div v-else>
            <v-chip v-if="index < 2">
              <span>{{ item.title }}</span>
            </v-chip>
            <span
              v-if="index === 2"
              class="text-grey text-caption align-self-center"
            >
          (+{{ filters.customers.selected.length - 2 }} others)
        </span>
          </div>

        </template>
      </v-select>
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
