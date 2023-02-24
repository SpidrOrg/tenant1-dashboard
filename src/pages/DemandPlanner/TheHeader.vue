<script>

export default {
  name: "TheHeader",
  props: {
    categories: {
      type: Array,
      required: true
    },
    customers: {
      type: Array,
      required: true
    },
    isByVolume: {
      type: Boolean,
      default: false
    }
  },
  emits: ['updateFilters'],
  data(){
    return {
      availableCategories: ['All', 'Shirts', 'Pants', 'Jackets', 'Sportswear', 'Shorts'], // to come from API
      availableCustomers: ['All', 'Amazon', 'Walmart', 'Home Depot'], // to come from API
      picker: new Date('02/2023')
    }
  },
  methods: {
    filtersUpdateHandler (name, value) {
      let val = value;

      if(value.includes('All')) {
        switch (name) {
          case 'categories':
            val = this.availableCategories
            break;
          case 'customers':
            val = this.availableCustomers
            break;
          default:
        }
      }

      this.$emit('updateFilters', {
        name,
        value: val
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
      <div class="tw-pt-3 tw-min-w-[14%] tw--mb-3">
        <v-select
          label="All Categories"
          :items="availableCategories"
          :model-value="categories"
          @update:modelValue="(value) => filtersUpdateHandler('categories', value)"
          multiple
          density="comfortable"
        />
      </div>
      <div class="tw-pt-3 tw-min-w-[14%] tw--mb-3">
        <v-select
          label="All Customers"
          :items="availableCustomers"
          :model-value="customers"
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
