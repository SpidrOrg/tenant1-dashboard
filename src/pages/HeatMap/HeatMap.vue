<script>
import _ from 'lodash';
import { format as formatFn } from 'date-fns';
import fetchHeatMapData from '@/api/HeatMap/fetchHeatMapData';
import FiltersSection from '@/pages/HeatMap/FiltersSection.vue';
import CardsList from '@/pages/HeatMap/CardsList.vue';
export default {
  name: 'HeatMap',
  components: {
    FiltersSection,
    CardsList,
  },
  data() {
    return {
      apiData: [],
      isLoading: true,
      error: null,
      debounceUpdateFilters: _.debounce(this.updateFilters, 3000),
      latestRefreshDate: null,
    };
  },
  methods: {
    latestRefreshDateUpdateHandler(dateObj) {
      this.latestRefreshDate = formatFn(dateObj, 'MMM dd, yyyy');
    },
    async updateFilters(filtersData, metaData) {
      this.isLoading = true;
      const selectedMarketSensingRefreshDate = _.get(
        filtersData,
        'refreshDates.selected'
      );
      const selectedValueORvolume = _.get(filtersData, 'valueOrQuantity');

      const jsDateRefreshDate = new Date(
        selectedMarketSensingRefreshDate.year,
        selectedMarketSensingRefreshDate.month
      );
      try {
        this.apiData = await fetchHeatMapData({
          ...metaData,
          marketSensingRefreshDate: new Date(
            jsDateRefreshDate.getTime() -
              jsDateRefreshDate.getTimezoneOffset() * 60000
          )
            .toISOString()
            .split('T')[0],
          valueORvolume: selectedValueORvolume,
        });
        if (_.isEmpty(this.apiData)) {
          this.error = 'Error: Unable to fetch data';
        }
      } catch (e) {
        this.error = e;
      }
      this.isLoading = false;
    },
  },
};
</script>

<template>
  <div class="tw-h-full tw-w-full tw-px-4 tw-pt-2 tw-pb-10 tw-bg-brand-gray-1">
    <div class="tw-flex tw-w-full tw-h-8 tw-bg-brand-gray-1">
      <div class="tw-flex tw-h-full tw-items-center">
        <h1 class="tw-text-lg">
          <span class="tw-font-bold">Heat-map View -</span>
          Representation of variance across categories and stores
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
        @latestRefreshDateUpdate="latestRefreshDateUpdateHandler"
      />
    </div>
    <div
      class="tw-w-full tw-h-3/4 tw-flex tw-justify-center tw-items-center"
      v-if="isLoading"
    >
      <v-progress-circular
        indeterminate
        color="#7823DC"
        :size="80"
        :width="10"
      />
    </div>
    <div v-if="!isLoading && !error">
      <CardsList :data="apiData" />
    </div>
    <div v-if="!isLoading && error">
      <v-alert type="error" :text="error.toString()"></v-alert>
    </div>
  </div>
</template>
