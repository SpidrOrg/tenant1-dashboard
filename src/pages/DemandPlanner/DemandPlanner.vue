<script>
import _ from 'lodash';
import { format as formatFn, parse } from 'date-fns';
import { getPeriodDataLabel, getConcisePeriodLabel } from './helpers';
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
const FILTER_UPDATE_GAP_MS = 300;
const FILTER_INSTANT_UPDATE_GAP_MS = 500;

const BY_VALUE = 'BY_VALUE';
const BY_QUANTITY = 'BY_QUANTITY';

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
    pageConfig: {
      type: Object,
      required: false
    }
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

      getPeriodDataLabel,
      getConcisePeriodLabel,

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
    isApiDataAvailable() {
      return _.size(_.get(this.dashboardData, 'periodsData')) > 0;
    },
  },
  methods: {
    formatHorizon(value) {
      if (!value) return '';
      const formattedValue = value.replaceAll('_', '-').replaceAll('m', '');
      return formattedValue;
    },
    toggleForecastPeriodType() {
      this.forecastPeriodType =
        this.forecastPeriodType === R3M_VIEW ? QUARTERLY_VIEW : R3M_VIEW;

      this.fetchDashboardData();
    },
    latestRefreshDateUpdateHandler(dateObj) {
      this.latestRefreshDate = formatFn(dateObj, 'MMM dd, yyyy');
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
      this.error = null;
      try {
        const response = await this.fetchApi({
          marketSensingRefreshDate:
            this.selectedFilters.marketSensingRefreshDate,
          categories: this.selectedFilters.category,
          valueORvolume: this.selectedFilters.valueOrQuantity === 'Value' ? BY_VALUE : BY_QUANTITY,
          splits: this.selectedFilters.splits
        });

        if (!_.isEmpty(response)) {
          this.dashboardData.periodsData = response;
          _.forEach(this.dashboardData.periodsData, (v, i) => {
            v.period = _.get(_.keys(v), '[0]');
            v.label = this.getPeriodDataLabel(
              v.period,
              this.forecastPeriodType
            );
            v.metrics = _.get(v, `${v.period}.metrics`, {});
            v.horizon = _.get(v, `${v.period}.horizon`, '');
            v.formattedHorizon = this.formatHorizon(v.horizon);
            delete v[v.period];

            v.metrics.historical = _.map(
              _.get(v.metrics, 'historical'),
              (el) => {
                const historicalPeriod = _.get(el, 'period');
                const periodLabel = this.getConcisePeriodLabel(
                  historicalPeriod,
                  this.forecastPeriodType
                );
                return { ...el, period: periodLabel };
              }
            );
            v.metrics.variance = _.round(
              _.subtract(v.metrics.marketSensingGrowth, v.metrics.jdaGrowth),
              0
            );
            v.checkboxLabel = this.getConcisePeriodLabel(
              v.period,
              this.forecastPeriodType
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
      const selectedValueORvolume = _.get(filtersData, 'valueOrQuantity.selected');
      const splits = _.get(filtersData, 'splits');

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

        this.selectedRefreshDate = formatFn(
          marketSensingRefreshDateP,
          'MMM yyyy'
        );

        this.selectedFilters = {
          marketSensingRefreshDate: marketSensingRefreshDate,
          category: selectedCategories,
          splits,
          valueOrQuantity: selectedValueORvolume
        };

        this.fetchDashboardData();
      } catch (e) {
        this.error = e;
        this.dataLoading = false;
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
        :isDataLoading="dataLoading"
        :pageConfig='pageConfig'
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
    <div
      class="tw-w-full tw-p-4 tw-bg-white"
      v-if="!dataLoading && !error && isApiDataAvailable"
    >
      <div
        class="tw-flex tw-flex-col tw-w-full tw-border-b tw-border-solid tw-border-brand-gray-2"
      >
        <h1
          class="desktop:tw-text-2xl small-laptop:tw-text-2xl tw-text-3xl tw-font-bold"
        >
          Future Demand Forecasting
        </h1>
        <div class="tw-flex tw-items-center tw-w-full">
          <p class="desktop:tw-text-sm small-laptop:tw-text-sm">
            Show demand projections for:
          </p>
          <div
            v-for="periodData in dashboardData.periodsData"
            :key="periodData.label"
            class="tw-flex tw-items-center tw-text-brand-primary"
          >
            <v-checkbox
              :id="`period${periodData.checkboxLabel}`"
              hide-details
              :disabled="isCheckDisabled(periodData.isChecked)"
              v-model="periodData.isChecked"
            />
            <label
              :for="`period${periodData.checkboxLabel}`"
              class="tw-text-black desktop:tw-text-sm small-laptop:tw-text-sm"
              >{{ periodData.checkboxLabel }}
            </label>
          </div>
          <div class="tw-flex tw-gap-x-3 tw-ml-auto small-laptop:tw-ml-3">
            <button
              class="small-laptop:tw-hidden tw-px-2 tw-py-1.5 tw-border tw-border-solid tw-border-brand-primary"
              @click="isModelAccuracyHidden = !isModelAccuracyHidden"
            >
              <div
                class="tw-flex tw-gap-x-2 desktop:tw-gap-x-1 small-laptop:tw-gap-x-0"
              >
                <img :src="isModelAccuracyHidden ? EyeIcon : EyeOffIcon" />
                <span class="tw-text-sm desktop:tw-text-xs">
                  {{ isModelAccuracyHidden ? 'Show' : 'Hide' }} Model Accuracy
                </span>
              </div>
            </button>
            <button
              class="tw-px-3 tw-py-1.5 small-laptop:tw-px-1 small-laptop:tw-py-1 tw-bg-brand-primary"
              @click="toggleForecastPeriodType"
              :disabled="dataLoading"
            >
              <span
                class="tw-text-white tw-text-sm desktop:tw-text-xs small-laptop:tw-text-xs"
              >
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
      <div
        class="tw-p-4 desktop:tw-p-1 tw-border tw-border-solid tw-border-brand-primary"
      >
        <ChartsSection
          v-if="activePeriodData"
          :activePeriodData="activePeriodData"
          :options="{
            selectedFilters,
            forecastPeriodType,
          }"
        />
      </div>
    </div>
    <div v-if="!dataLoading && error">
      <v-alert type="error" :text="error.toString()"></v-alert>
    </div>
  </div>
</template>
