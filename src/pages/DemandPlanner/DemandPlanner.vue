<script>
import _ from 'lodash';
import { format as formatFn } from 'date-fns';
import { getQuarterLabel } from '@/utils/dateHelpers';
import EyeIcon from '@/images/eye-icon.svg';
import EyeOffIcon from '@/images/eye-off-icon.svg';
import { FORECAST_PERIOD_TYPES } from './constants';
import fetchR3MData from '@/api/DemandPlanner/fetchR3MData';
import fetchQuarterlyData from '@/api/DemandPlanner/fetchQuarterlyData';

import FiltersSection, {
  ALL_OPTION,
} from '@/pages/DemandPlanner/FiltersSection.vue';
import CardsList from './CardsList.vue';
import ChartsSection from '@/pages/DemandPlanner/ChartsSection/ChartsSection.vue';

const { R3M_VIEW, QUARTERLY_VIEW } = FORECAST_PERIOD_TYPES;
const FILTER_UPDATE_GAP_MS = 3000;
const FILTER_INSTANT_UPDATE_GAP_MS = 500;

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
      required: true,
    },
  },
  data() {
    return {
      dataLoading: true,
      error: null,
      debounceUpdateFilters: _.debounce(
        this.updateFilters,
        FILTER_UPDATE_GAP_MS
      ),
      debounceUpdateFiltersInstant: _.debounce(
        this.updateFilters,
        FILTER_INSTANT_UPDATE_GAP_MS
      ),
      dashboardData: {},
      selectedFilters: {
        marketSensingRefreshDate: null,
        category: '',
        customer: '',
        valueORvolume: null,
      },
      latestRefreshDate: null,
      selectedRefreshDate: null,
      isModelAccuracyHidden: false,
      forecastPeriodType: R3M_VIEW,

      R3M_VIEW,
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
    userId() {
      return _.get(this.userdata, 'deocdedJWT.email');
    },
    userDisplayName() {
      let userDisplayName = _.get(this.userdata, 'deocdedJWT.name');
      if (!userDisplayName) {
        const { isAdmin } = this.userdata;
        const userEmail = _.get(this.userdata, 'deocdedJWT.email');
        userDisplayName = isAdmin ? `${userEmail}[admin]` : userEmail;
      }
      return userDisplayName;
    },
    fetchApi() {
      if (this.forecastPeriodType === QUARTERLY_VIEW) {
        return fetchQuarterlyData;
      }
      return fetchR3MData;
    },
  },
  methods: {
    toggleForecastPeriodType() {
      this.forecastPeriodType =
        this.forecastPeriodType === R3M_VIEW ? QUARTERLY_VIEW : R3M_VIEW;

      this.fetchDashboardData();
    },
    latestRefreshDateUpdateHandler(dateObj) {
      this.latestRefreshDate = formatFn(dateObj, 'MMM dd, yyyy');
    },
    getPeriodDataLabel(period) {
      if (this.forecastPeriodType === R3M_VIEW) return period;
      return getQuarterLabel(period);
    },
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
    async fetchDashboardData() {
      this.dataLoading = true;
      try {
        const response = await this.fetchApi({
          marketSensingRefreshDate:
            this.selectedFilters.marketSensingRefreshDate,
          categories: this.selectedFilters.category,
          customers: this.selectedFilters.customer,
          valueORvolume: this.selectedFilters.valueOrQuantity,
        });

        if (!_.isEmpty(response)) {
          this.dashboardData.periodsData = response;
          _.forEach(this.dashboardData.periodsData, (v, i) => {
            v.period = _.get(_.keys(v), '[0]');
            v.label = this.getPeriodDataLabel(v.period);
            v.metrics = _.get(v, `${v.period}.metrics`, {});
            v.lag = _.get(v, `${v.period}.futureLagMonths`, '');
            v.modelAccuracy = _.get(v, `${v.period}.modelAccuracy`, null);
            delete v[v.period];

            v.metrics.historical = _.map(
              _.get(v.metrics, 'historical'),
              (el) => {
                const historicalPeriod = _.get(el, 'period');
                const periodLabel = this.getPeriodDataLabel(historicalPeriod);
                return { ...el, period: periodLabel };
              }
            );
            v.metrics.variance = _.round(
              _.subtract(v.metrics.marketSensingGrowth, v.metrics.jdaGrowth),
              0
            );
            v.isChecked = true;
            v.isActive = i === 0;
          });
        } else {
          throw new Error('Unable to fetch data');
        }
      } catch (e) {
        this.error = e;
      }
      this.dataLoading = false;
    },
    async updateFilters(filtersData) {
      const selectedMarketSensingRefreshDate = _.get(
        filtersData,
        'refreshDates.selected'
      );
      const selectedCategories = _.get(filtersData, 'categories.selected');
      const selectedCustomers = _.get(filtersData, 'customers.selected');
      const selectedValueORvolume = _.get(filtersData, 'valueOrQuantity');

      try {
        const jsDateRefreshDate = new Date(
          selectedMarketSensingRefreshDate.year,
          selectedMarketSensingRefreshDate.month
        );
        const marketSensingRefreshDate = new Date(
          jsDateRefreshDate.getTime() -
            jsDateRefreshDate.getTimezoneOffset() * 60000
        )
          .toISOString()
          .split('T')[0];

        this.selectedRefreshDate = formatFn(jsDateRefreshDate, 'MMM yyyy');

        this.selectedFilters = {
          marketSensingRefreshDate: marketSensingRefreshDate,
          category: selectedCategories,
          customer: selectedCustomers === ALL_OPTION ? '*' : selectedCustomers,
          valueOrQuantity: selectedValueORvolume,
        };

        this.fetchDashboardData();
      } catch (e) {
        this.error = e;
      }
    },
  },
};
</script>

<template>
  <div class="tw-h-full tw-w-full tw-bg-brand-gray-1">
    <div class="tw-flex tw-w-full tw-h-8 tw-bg-brand-gray-1">
      <h1 class="tw-flex tw-h-full tw-items-center tw-font-bold tw-text-lg">
        Demand Planner Dashboard
        {{ selectedRefreshDate ? `as of ${selectedRefreshDate}` : '' }}
      </h1>
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
      />
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
    <div class="tw-w-full tw-p-4 tw-bg-white" v-if="!dataLoading && !error">
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
              class="tw-px-2 tw-py-1.5 tw-border tw-border-solid tw-border-brand-primary"
              @click="isModelAccuracyHidden = !isModelAccuracyHidden"
            >
              <div class="tw-flex tw-gap-x-2">
                <img :src="isModelAccuracyHidden ? EyeIcon : EyeOffIcon" />
                <span class="tw-text-sm">
                  {{ isModelAccuracyHidden ? 'Show' : 'Hide' }} Model Accuracy
                </span>
              </div>
            </button>
            <button
              class="tw-px-3 tw-py-1.5 tw-bg-brand-primary"
              @click="toggleForecastPeriodType"
              :disabled="dataLoading"
            >
              <span class="tw-text-white tw-text-sm">
                Switch to
                {{
                  forecastPeriodType === R3M_VIEW
                    ? 'Fixed/Quarterly'
                    : 'Rolling 3 Months'
                }}
                View
              </span>
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
          :options="{
            isModelAccuracyHidden,
            selectedFilters,
            userData: { userId, userDisplayName },
            forecastPeriodType,
          }"
        />
      </div>
      <div class="tw-p-4 tw-border tw-border-solid tw-border-brand-primary">
        <ChartsSection
          v-if="activePeriodData"
          :activePeriodData="activePeriodData"
        />
      </div>
    </div>
    <div v-if="!dataLoading && error">
      <v-alert type="error" :text="error.toString()"></v-alert>
    </div>
  </div>
</template>
