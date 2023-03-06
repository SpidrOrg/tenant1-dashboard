<script>
import _ from "lodash";
import FiltersSection, {ALL_OPTION} from "@/pages/DemandPlanner/FiltersSection.vue";
import fetchMainDashboardData from "@/api/fetchMainDashboardData";

export default {
  name: "DemandPlanner",
  components: {
    FiltersSection
  },
  data(){
    return {
      dataLoading: true,
      debounceUpdateFilters: _.debounce(this.updateFilters, 3000),
      dashboardData: {}
    }
  },
  methods: {
    async updateFilters(filtersData){
      this.dataLoading = true;
      const selectedMarketSensingRefreshDate = _.get(filtersData, "refreshDates.selected");
      const selectedCategories = _.get(filtersData, "categories.selected");
      const selectedCustomers = _.get(filtersData, "customers.selected");
      const selectedValueORvolume = _.get(filtersData, "valueOrQuantity");

      const jsDateRefreshDate = new Date(selectedMarketSensingRefreshDate.year, selectedMarketSensingRefreshDate.month);
      this.dashboardData = await fetchMainDashboardData({
        marketSensingRefreshDate: new Date(jsDateRefreshDate.getTime() - (jsDateRefreshDate.getTimezoneOffset() * 60000 ))
          .toISOString()
          .split("T")[0],
        categories: _.includes(selectedCategories, ALL_OPTION) ? "*" : selectedCategories.join(","),
        customers: _.includes(selectedCustomers, ALL_OPTION) ? "*" : selectedCustomers.join(","),
        valueORvolume: selectedValueORvolume
      });

      if (this.dashboardData){
        this.dataLoading = false;
      }
    }
  }
}
</script>

<template>
  <div class="tw-h-full tw-w-full tw-bg-brand-gray-1">
    <div class="tw-flex tw-w-full tw-h-8 tw-bg-brand-gray-1">
      <div class="tw-flex tw-h-full tw-items-center tw-font-bold tw-text-lg">
        Demand Planner Dashboard as of
      </div>
      <div class="tw-ml-auto tw-h-full tw-flex tw-items-center">
        Last refreshed on
      </div>
    </div>
    <div class="tw-flex tw-w-full tw-flex-auto tw-border-t tw-border-solid tw-border-brand-gray-2"/>
    <div class="tw-py-5" >
      <FiltersSection
        @update-filters="debounceUpdateFilters"
      />
    </div>
    <div class="tw-w-full tw-h-3/4 tw-flex tw-justify-center tw-items-center" v-if="dataLoading">
      <v-progress-circular indeterminate color="#7823DC" :size="80" :width="10"/>
    </div>
    <div class="tw-w-full tw-p-4 tw-bg-white" v-else>
      <div class="tw-flex tw-flex-col tw-w-full tw-border-b tw-border-solid tw-border-brand-gray-2">
        <h1 class="tw-text-3xl tw-font-bold">Future Demand Forecasting</h1>
        <div class="tw-flex tw-items-center tw-w-full">
          <p>Show demand projections for:</p>

        </div>
      </div>
    </div>
  </div>
</template>
