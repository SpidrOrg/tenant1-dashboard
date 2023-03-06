<script>
import _ from 'lodash';

const SELECT_ALL = "Select All";
export default {
  name: "TheHeader",
  props: {
    refreshDates: {
      type: Object,
      required: true,
    },
    categories: {
      type: Object,
      required: true,
    },
    customers: {
      type: Object,
      required: true
    },
    isByVolume: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    selectedCategories(){
      const allItems = _.get(this, "categories.items", []);
      let itemsSelected = _.get(this, "categories.selected", []);

      if (_.size(allItems) === _.size(itemsSelected) &&
        _.xor(allItems, itemsSelected).length === 0){
        itemsSelected = _.concat(SELECT_ALL, itemsSelected ?? []);
      }
      return itemsSelected;
    },
    isAllCategoriesSelected(){
      const allItems = _.get(this, "categories.items", []);
      const itemsSelected = _.get(this, "categories.selected", []);

      return _.size(allItems) === _.size(itemsSelected) &&
        _.xor(allItems, itemsSelected).length === 0;
    },
    isAllCustomersSelected(){
      const allItems = _.get(this, "customers.items", []);
      const itemsSelected = _.get(this, "customers.selected", []);

      return _.size(allItems) === _.size(itemsSelected) &&
        _.xor(allItems, itemsSelected).length === 0;
    }
  },
  emits: ['updateFilters'],
  data(){
    return {
      picker: new Date('02/2023'),
      SELECT_ALL,
      concat: _.concat
    }
  },
  methods: {
    filtersUpdateHandler (name, value) {
      console.log(this.categories.selected);
      const newItemsSelected = _.size(_.omit(value, SELECT_ALL)) > _.size(this.categories.selected);
      if(newItemsSelected && value.includes(SELECT_ALL)) {
        switch (name) {
          case 'categories':
            value = this.categories.items
            break;
          case 'customers':
            value = this.customers.items
            break;
          default:
        }
      } else {
        if (_.includes(_.xor(value, this.categories.selected), SELECT_ALL)){
          value = []
        }
      }

      this.$emit('updateFilters', {
        name,
        value
      })
    }
  }
}
</script>

<template>
  <div class="tw-flex tw-gap-x-3 tw-w-full tw-bg-white tw-px-3">
      <div class="tw-pt-3 tw-min-w-[14%] tw--mb-3">
        <VueDatePicker v-model="picker" month-picker>
          <template  #dp-input="{ value }">
            <v-text-field  :value="value" density="comfortable"></v-text-field>
          </template>
        </VueDatePicker>
      </div>
    isAllCategoriesSelected{{isAllCategoriesSelected}}
      <div class="tw-pt-3 tw-min-w-[14%] tw--mb-3">
        <v-select
          label="All Categories"
          :items="concat(SELECT_ALL, categories.items)"
          :model-value="selectedCategories"
          @update:modelValue="(value) => filtersUpdateHandler('categories', value)"
          multiple
          density="comfortable"
        />
      </div>
      <div class="tw-pt-3 tw-min-w-[14%] tw--mb-3">
        <v-select
          label="All Customers"
          :items="`${[...customers.items, ...[SELECT_ALL]]}`"
          :model-value="customers.selected"
          @update:modelValue="(value) => filtersUpdateHandler('customers', value)"
          multiple
          density="comfortable"
        />
      </div>
      <div class="tw-flex tw-gap-1.5 tw-pl-3 tw--mb-3">
        <p :class="`tw-pt-6 ${!isByVolume ? 'tw-font-medium' : ''}`">Value (USD)</p>
        <div class="tw-flex tw-pt-2" style="color: #7823DC;">
          <v-switch :model-value="isByVolume" inset @click="$emit('updateFilters', {
            name: 'isByVolume',
            value: !isByVolume
          })"/>
        </div>
        <p :class="`tw-pt-6 ${isByVolume ? 'tw-font-medium' : ''}`">Volume</p>
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
