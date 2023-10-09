<script>
import _ from 'lodash';
import { format as formatFn, parse, endOfMonth } from 'date-fns';
import fetchDashboardOptions from '@/api/fetchDashboardOptions';

const BY_VALUE = 'Value';
const BY_QUANTITY = 'Quantity';
const ITEMS_SEP = "___";
export const ALL_OPTION = 'All';

const AVAILABLE_SPLITS = {
  split1: {
    displayName: "Customers",
    dataName: "Retailer Final"
  },
  split2: {
    displayName: "Region",
    dataName: "Region Final",
    multiSelect: true
  },
  split3: {
    displayName: "Portfolio",
    dataName: "Portfolio Final",
    multiSelect: true,
  }
}

export default {
  name: 'FilterSelection',
  props: {
    isDataLoading: { type: Boolean, default: false },
    pageConfig: {
      type: Object,
      required: false
    },
    uiConfig: {
      type: Object,
      required: false
    },
  },
  data() {
    const toReturn = {
      filterOptions: null,
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
        valueOrQuantity: {
          items: [BY_VALUE, BY_QUANTITY],
          selected: null,
          filterlabel: 'Value (USD) / Volume',
        }
      },
      currency: 'USD',
      dataLoaded: false,

      BY_VALUE,
      BY_QUANTITY,
      ALL_OPTION,
      includes: _.includes,
    };
    _.forEach(_.keys(AVAILABLE_SPLITS), v => {
      const splitConfig = AVAILABLE_SPLITS[v];
      toReturn.filters[v] = {
        items: [],
        selected: null,
        filterlabel: splitConfig.displayName,
      }
    })
    return toReturn;
  },

  async created() {
    // Make API call to get available options for the filters
    const options = await fetchDashboardOptions().catch(() => null);
    const msPivots = _.reduce(_.split(_.get(options, `ms.pivots`), "%^"), (acc, v) => {
      const [splitName, splitItems] = _.split(v, "&^");
      acc[splitName] = splitItems;
      return acc;
    }, {});
    this.filterOptions = options;
    if (options) {
      this.filters.categories.items = _.get(options, 'ms.categories');

      _.forEach(_.keys(AVAILABLE_SPLITS), v => {
        const splitConfig = AVAILABLE_SPLITS[v];
        this.filters[v].items = _.split(_.get(msPivots, `${splitConfig.dataName}`), ITEMS_SEP);
      })
      this.filters.refreshDates.items = _.get(options, 'updateDates');
    }

    // Add all option to the splits filters
    _.forEach(_.keys(AVAILABLE_SPLITS), v => {
      this.filters[v].items = _.concat(
        ALL_OPTION,
        this.filters[v].items
      );
    });

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
    _.forEach(_.keys(AVAILABLE_SPLITS), v => {
      this.selectFilterUpdated(
        v,
        this.filters[v].items[0],
        true
      );
    });
    this.selectFilterUpdated(
      'valueOrQuantity',
      BY_QUANTITY,
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
      if (AVAILABLE_SPLITS[filterName] && AVAILABLE_SPLITS[filterName].multiSelect){
        if(_.indexOf(currentSelection, ALL_OPTION) > 0){
          currentSelection = [ALL_OPTION];
        } else if(_.indexOf(currentSelection, ALL_OPTION) === 0 && _.size(currentSelection) > 1){
          currentSelection = _.slice(currentSelection, 1);
        }
      }
      this.filters[filterName].selected = currentSelection;
      isInstant ? this.filterUpdatedInstant() : this.filtersUpdated();
    },
    refreshDateUpdated({ month, year }, isInstant = false) {
      this.filters.refreshDates.selected = { month, year };
      isInstant ? this.filterUpdatedInstant() : this.filtersUpdated();
    },

    filtersUpdated() {
      this.filters.splits = this.splitsSelectionVal;
      this.$emit('updateFilters', _.assign({}, this.filters));
    },
    filterUpdatedInstant() {
      this.filters.splits = this.splitsSelectionVal;
      this.$emit('updateFiltersInstant', _.assign({}, this.filters));
    }
  },
  computed: {
    splitsSelectionVal(){
      let val = '';
      _.forEach(_.get(this.uiConfig, 'pivot'), (v, i) => {
        const filterName = _.find(_.keys(AVAILABLE_SPLITS), k =>{
          return AVAILABLE_SPLITS[k].dataName === v
        });
        const optionsJoin = Array.isArray(this.filters[filterName].selected)
          ? _.join(this.filters[filterName].selected.map(v => {
            return v === ALL_OPTION ? "*" : v;
          }), ITEMS_SEP)
          : (
            this.filters[filterName].selected
            ? (this.filters[filterName].selected === ALL_OPTION ? '*' : this.filters[filterName].selected)
            : ''
          )
        val += `${val ? '^%' : ''}${v}_._${optionsJoin}`;
      });
      return val;
    }
  }
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
        @update:modelValue="(value) => selectFilterUpdated('categories', value, true)"
        density="comfortable"
        :disabled="isDataLoading"
      />
    </div>
    <div v-if="filters.split1" class="tw-pt-3 tw-min-w-[14%] tw--mb-3">
      <label :for="filters.split1.filterlabel" class="tw-text-sm">{{ filters.split1.filterlabel }}</label>
      <v-select
        :id="filters.split1.filterlabel"
        :items="filters.split1.items"
        :model-value="filters.split1.selected"
        @update:modelValue="(value) => selectFilterUpdated('split1', value, true)"
        density="comfortable"
        :disabled="isDataLoading"
      />
    </div>
    <div class="tw-pt-3 tw-min-w-[14%] tw--mb-3">
      <label for="valvol" class="tw-text-sm">Value (USD) / Volume</label>
      <v-select
        id="customers"
        :items="filters.valueOrQuantity.items"
        :model-value="filters.valueOrQuantity.selected"
        @update:modelValue="(value) => selectFilterUpdated('valueOrQuantity', value, true)"
        density="comfortable"
        :disabled="isDataLoading"
      />
    </div>
    <div class="tw-pt-3 tw-min-w-[14%] tw--mb-3">
      <label :for="filters.split2.filterlabel" class="tw-text-sm">{{ filters.split2.filterlabel }}</label>
      <v-select
        v-if="filters.split2"
        :id="filters.split2.filterlabel"
        :items="filters.split2.items"
        :model-value="filters.split2.selected"
        @update:modelValue="(value) => selectFilterUpdated('split2', value, false)"
        density="comfortable"
        :disabled="isDataLoading"
        multiple
      />
    </div>
    <div class="tw-pt-3 tw-min-w-[14%] tw--mb-3">
      <label :for="filters.split3.filterlabel" class="tw-text-sm">{{ filters.split3.filterlabel }}</label>
      <v-select
        v-if="filters.split3"
        :id="filters.split3.filterlabel"
        :items="filters.split3.items"
        :model-value="filters.split3.selected"
        @update:modelValue="(value) => selectFilterUpdated('split3', value, false)"
        density="comfortable"
        :disabled="isDataLoading"
        multiple
      />
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
