<script>
import _ from 'lodash';
import EyeIcon from '@/images/eye-icon.svg';
import EyeOffIcon from '@/images/eye-off-icon.svg';
import FiltersSection, {
  ALL_OPTION,
} from '@/pages/DemandPlanner/FiltersSection.vue';
import CardsList from './CardsList.vue';
import fetchMainDashboardData from '@/api/fetchMainDashboardData';
import ChartsSection from '@/pages/DemandPlanner/ChartsSection/ChartsSection.vue';

export default {
  name: 'DemandPlanner',
  components: {
    FiltersSection,
    CardsList,
    ChartsSection,
  },
  props: {
    userdata: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      dataLoading: true,
      debounceUpdateFilters: _.debounce(this.updateFilters, 3000),
      dashboardData: {},
      isModelAccuracyHidden: false,

      //
      EyeIcon,
      EyeOffIcon,
      lodGet: _.get,
    };
  },
  computed: {
    selectedCards() {
      return _.filter(
        _.get(this.dashboardData, 'periodsData'),
        (v) => v.isChecked
      );
    },
    activePeriodData() {
      return _.find(
        _.get(this.dashboardData, 'periodsData'),
        (v) => v.isActive
      );
    },
  },
  methods: {
    isCheckDisabled(isChecked) {
      return (
        isChecked &&
        _.size(
          _.filter(
            _.map(this.dashboardData.periodsData, (v) => v.isChecked),
            (v) => v === true
          )
        ) === 1
      );
    },
    setActiveCard(activeCardIndex) {
      _.forEach(_.get(this.dashboardData, 'periodsData'), (v, i) => {
        _.set(
          this.dashboardData,
          `periodsData[${i}].isActive`,
          i === activeCardIndex
        );
      });
    },
    async updateFilters(filtersData) {
      this.dataLoading = true;
      const selectedMarketSensingRefreshDate = _.get(
        filtersData,
        'refreshDates.selected'
      );
      const selectedCategories = _.get(filtersData, 'categories.selected');
      const selectedCustomers = _.get(filtersData, 'customers.selected');
      const selectedValueORvolume = _.get(filtersData, 'valueOrQuantity');

      const jsDateRefreshDate = new Date(
        selectedMarketSensingRefreshDate.year,
        selectedMarketSensingRefreshDate.month
      );
      const response = await fetchMainDashboardData({
        marketSensingRefreshDate: new Date(
          jsDateRefreshDate.getTime() -
            jsDateRefreshDate.getTimezoneOffset() * 60000
        )
          .toISOString()
          .split('T')[0],
        categories:
          selectedCategories === ALL_OPTION ? '*' : selectedCategories,
        customers: selectedCustomers === ALL_OPTION ? '*' : selectedCustomers,
        valueORvolume: selectedValueORvolume,
      });

      if (!_.isEmpty(response)) {
        this.dataLoading = false;
        this.dashboardData.periodsData = response;
        _.forEach(this.dashboardData.periodsData, (v, i) => {
          v.label = _.get(_.keys(v), '[0]');
          v.metrics = _.get(v, `${v.label}.metrics`, {});
          v.lag = _.get(v, `${v.label}.futureLagMonths`, '');
          v.modelAccuracy = _.get(v, `${v.label}.modelAccuracy`, null);
          delete v[v.label];

          v.metrics.variance = _.round(
            _.subtract(v.metrics.jdaGrowth, v.metrics.marketSensingGrowth),
            0
          );
          v.isChecked = true;
          v.isActive = i === 0;
        });
      }
    },
  },
};
</script>

<template>
  <div class="tw-h-full tw-w-full tw-bg-brand-gray-1">
    <div class="tw-flex tw-w-full tw-h-8 tw-bg-brand-gray-1">
      <div class="tw-flex tw-h-full tw-items-center tw-font-bold tw-text-lg">
        Demand Planner Dashboard as of Feb 2023
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
      v-if="dataLoading"
    >
      <v-progress-circular
        indeterminate
        color="#7823DC"
        :size="80"
        :width="10"
      />
    </div>
    <div class="tw-w-full tw-p-4 tw-bg-white" v-else>
      <div
        class="tw-flex tw-flex-col tw-w-full tw-border-b tw-border-solid tw-border-brand-gray-2"
      >
        <h1 class="tw-text-3xl tw-font-bold">Future Demand Forecasting</h1>
        <div class="tw-flex tw-items-center tw-w-full">
          <p>Show demand projections for:</p>
          <div
            v-for="periodData in dashboardData.periodsData"
            :key="periodData.label"
            class="tw-flex tw-items-center"
          >
            <v-checkbox
              :id="`period${periodData.label}`"
              color="#7823DC"
              hide-details
              :disabled="isCheckDisabled(periodData.isChecked)"
              v-model="periodData.isChecked"
            />
            <label :for="`period${periodData.label}`">{{
              periodData.label
            }}</label>
          </div>
          <div class="tw-flex tw-gap-x-3 tw-ml-auto">
            <button
              class="tw-px-2 tw-py-1.5"
              style="border: 1px solid #7823dc"
              @click="isModelAccuracyHidden = !isModelAccuracyHidden"
            >
              <div class="tw-flex tw-gap-x-2">
                <img :src="isModelAccuracyHidden ? EyeIcon : EyeOffIcon" />
                <span class="tw-text-sm"
                  >{{ isModelAccuracyHidden ? 'Show' : 'Hide' }} Model
                  Accuracy</span
                >
              </div>
            </button>
            <button class="tw-px-3 tw-py-1.5" style="background: #7823dc">
              <span class="tw-text-white tw-text-sm"
                >Switch to Fixed/Quarterly View</span
              >
            </button>
          </div>
        </div>
      </div>

      <div
        class="tw-flex tw-justify-center tw-gap-2.5 tw-w-full tw-py-5"
        v-if="lodGet(dashboardData, 'periodsData.length')"
      >
        <CardsList
          :data="selectedCards"
          @setActiveCard="setActiveCard"
          :options="{ isModelAccuracyHidden }"
        />
      </div>
      <div class="tw-p-4" style="border: 1px solid #7823dc">
        <div class="tw-flex tw-gap-x-4 tw-items-center tw-w-full tw-py-2">
          <p class="tw-font-medium tw-text-2xl">
            More details for {{ activePeriodData.label }}
          </p>
          <div class="tw-bg-brand-gray-4 tw-rounded">
            <p class="tw-p-1 tw-text-sm">
              Future {{ activePeriodData.lag }} months
            </p>
          </div>
        </div>
        <div class="tw-py-3 tw-w-full" v-if="activePeriodData">
          <ChartsSection
            :data="activePeriodData.metrics"
            :projectedPeriod="activePeriodData.label"
          />
        </div>
      </div>
    </div>
  </div>
</template>
