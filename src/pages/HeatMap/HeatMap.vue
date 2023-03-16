<script>
import _ from 'lodash';
import fetchHeatMapData from '@/api/fetchHeatMapData';
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
    };
  },
  methods: {
    async updateFilters(filtersData) {
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
      <div class="tw-flex tw-h-full tw-items-center tw-font-bold tw-text-lg">
        Heat-map View
      </div>
      <div class="tw-ml-auto tw-h-full tw-flex tw-items-center">
        Last refreshed on 01 Jan 2023
      </div>
    </div>
    <div
      class="tw-flex tw-w-full tw-flex-auto tw-border-t tw-border-solid tw-border-brand-gray-2"
    />
    <div class="tw-py-5">
      <FiltersSection @update-filters="debounceUpdateFilters" />
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
  </div>
</template>
