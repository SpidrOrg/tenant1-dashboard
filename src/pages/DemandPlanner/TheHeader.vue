<script>
export default {
  name: 'TheHeader',
  props: {
    category: String,
    customers: {
      type: Array,
      required: true,
    },
    isByVolume: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['updateFilters'],
  data() {
    return {
      availableCategories: ['Shirts', 'Pants', 'Jackets', 'Shorts'], // to come from API
      availableCustomers: ['All', 'Amazon', 'Walmart', 'Home Depot'], // to come from API
      picker: new Date('02/2023'),
    };
  },
  methods: {
    filtersUpdateHandler(name, value) {
      let val = value;

      if (name === 'customers' && value.includes('All')) {
        val = this.availableCustomers;
      }

      this.$emit('updateFilters', {
        name,
        value: val,
      });
    },
  },
};
</script>

<template>
  <div class="tw-flex tw-gap-x-3 tw-w-full tw-bg-white tw-px-3">
    <div class="tw-pt-3 tw-min-w-[14%] tw--mb-3">
      <VueDatePicker v-model="picker" month-picker>
        <template #dp-input="{ value }">
          <v-text-field :value="value" density="comfortable"></v-text-field>
        </template>
      </VueDatePicker>
    </div>
    <div class="tw-pt-3 tw-min-w-[14%] tw--mb-3">
      <v-select
        label="Category"
        :items="availableCategories"
        :model-value="category"
        @update:modelValue="(value) => filtersUpdateHandler('category', value)"
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
      <span :class="`tw-pt-6 ${!isByVolume ? 'tw-font-medium' : ''}`">
        Value (USD)
      </span>
      <div class="tw-flex tw-pt-2" style="color: #7823dc">
        <v-switch
          :model-value="isByVolume"
          inset
          @click="filtersUpdateHandler('isByVolume', !isByVolume)"
        />
      </div>
      <span :class="`tw-pt-6 ${isByVolume ? 'tw-font-medium' : ''}`">
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
