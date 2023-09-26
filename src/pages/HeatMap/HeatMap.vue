<script>
import _ from 'lodash';
import { format as formatFn, parse } from 'date-fns';
import fetchHeatMapData from '@/api/HeatMap/fetchHeatMapData';
import FiltersSection from '@/pages/HeatMap/FiltersSection.vue';
import CardsList from '@/pages/HeatMap/CardsList.vue';

export const LAG_VALUES = [1, 4, 7, 10];
const FILTER_UPDATE_GAP_MS = 300;
const FILTER_INSTANT_UPDATE_GAP_MS = 500;

export default {
  name: 'HeatMap',
  components: {
    FiltersSection,
    CardsList,
  },
  data() {
    return {
      apiData: [],
      isFetchingData: true,
      error: null,
      selectedFilters: {
        marketSensingRefreshDate: null,
        valueORvolume: null,
      },
      debounceUpdateFilters: _.debounce(
        this.updateFilters,
        FILTER_UPDATE_GAP_MS
      ),
      debounceUpdateFiltersInstant: _.debounce(
        this.updateFilters,
        FILTER_INSTANT_UPDATE_GAP_MS
      ),
      latestRefreshDate: null,
    };
  },
  methods: {
    latestRefreshDateUpdateHandler(dateObj) {
      this.latestRefreshDate = formatFn(dateObj, 'MMM dd, yyyy');
    },
    async fetchDashboardData(metaData) {
      this.isFetchingData = true;
      this.error = null;
      try {
        this.apiData = await Promise.all(
          _.map(LAG_VALUES, (lag) => {
            return fetchHeatMapData({
              ...metaData,
              marketSensingRefreshDate:
                this.selectedFilters.marketSensingRefreshDate,
              valueORvolume: this.selectedFilters.valueORvolume,
              lag: lag,
            });
          })
        );

        if (_.isEmpty(this.apiData)) {
          this.error = 'Error: Unable to fetch data';
        }
      } catch (e) {
        this.error = e;
      }
      this.isFetchingData = false;
    },
    async updateFilters(filtersData, metaData) {
      const selectedMarketSensingRefreshDate = _.get(
        filtersData,
        'refreshDates.selected'
      );
      const selectedValueORvolume = _.get(filtersData, 'valueOrQuantity');

      try {
        if (selectedMarketSensingRefreshDate === null) {
          throw new Error('Market Sensing Refresh Date is not available.');
        }

        const marketSensingRefreshDateP = parse(
          `${selectedMarketSensingRefreshDate.year}-${
            selectedMarketSensingRefreshDate.month + 1
          }`,
          'yyyy-M',
          new Date()
        );
        const marketSensingRefreshDate = formatFn(
          marketSensingRefreshDateP,
          'yyyy-MM-dd'
        );

        this.selectedFilters = {
          marketSensingRefreshDate: marketSensingRefreshDate,
          valueORvolume: selectedValueORvolume,
        };

        this.fetchDashboardData(metaData);
      } catch (e) {
        this.error = e;
        this.isFetchingData = false;
      }
    },
  },
};
</script>

<template>
  <div class="tw-h-full tw-w-full tw-pb-10 tw-bg-brand-gray-1">
    <div class="tw-flex tw-w-full tw-h-8 tw-bg-brand-gray-1">
      <div class="tw-flex tw-h-full tw-items-center">
        <h1 class="tw-text-lg">
          <span class="tw-font-bold">Heat-map View -</span>
          Representation of variance across categories and channels
        </h1>
      </div>
      <div
        class="tw-ml-auto tw-h-full tw-flex tw-items-center"
        v-if="latestRefreshDate"
      >
        Last refreshed on {{ latestRefreshDate }}
      </div>
    </div>
    <div
      class="tw-flex tw-w-full tw-flex-auto tw-border-t tw-border-solid tw-border-brand-gray-2"
    />
    <div class="tw-py-5">
      <FiltersSection
        @update-filters="debounceUpdateFilters"
        @update-filters-instant="debounceUpdateFiltersInstant"
        @latestRefreshDateUpdate="latestRefreshDateUpdateHandler"
        :isDataLoading="isFetchingData"
      />
    </div>
    <div
      class="tw-w-full tw-h-3/4 tw-flex tw-justify-center tw-items-center"
      v-if="isFetchingData"
    >
      <v-progress-circular
        indeterminate
        color="#7823DC"
        :size="80"
        :width="10"
      />
    </div>
    <div v-if="!isFetchingData && !error">
      <CardsList :data="apiData" :selectedFilters="selectedFilters" />
    </div>
    <div v-if="!isFetchingData && error">
      <v-alert type="error" :text="error.toString()"></v-alert>
    </div>
  </div>
</template>
