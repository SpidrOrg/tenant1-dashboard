<script>
import _ from 'lodash';
import { GChart } from 'vue-google-charts';
import { format as formatFn, parse } from 'date-fns';
import { getPeriodDataLabel, getConcisePeriodLabel } from './helpers';
import EyeIcon from '@/images/eye-icon.svg';
import EyeOffIcon from '@/images/eye-off-icon.svg';
import { FORECAST_PERIOD_TYPES } from './constants';
import fetchR3MData from '@/api/DemandPlannerMonthly/fetchR3MData';
import fetchQuarterlyData from '@/api/DemandPlannerMonthly/fetchQuarterlyData';

import FiltersSection, {
  ALL_OPTION,
} from '@/pages/DemandPlanner/FiltersSection.vue';
import ChartKeyDemandDrivers from "@/pages/DemandPlannerMonthlyNew/ChartsSection/ChartKeyDemandDrivers.vue";
import ModelAccuracySection from "@/pages/DemandPlannerMonthlyNew/ModelAccuracySection/ModelAccuracySection.vue";
import ActionForm from "@/pages/DemandPlanner/ActionForm.vue";
import VarianceAction from "@/pages/DemandPlannerMonthlyNew/VarianceAction/VarianceAction.vue";

const { R3M_VIEW, QUARTERLY_VIEW } = FORECAST_PERIOD_TYPES;
const FILTER_UPDATE_GAP_MS = 300;
const FILTER_INSTANT_UPDATE_GAP_MS = 500;

export default {
  name: 'DemandPlanner',
  components: {
    ActionForm,
    ModelAccuracySection,
    ChartKeyDemandDrivers,
    GChart,
    FiltersSection,
    VarianceAction
  },
  props: {
    userdata: {
      type: Object,
      required: true,
    },
  },
  data() {
    const toReturn = {
      dataLoading: true,
      error: null,
      actionFormIsShown: false,
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
      lodGet: _.get
    };
    return toReturn;
  },
  computed: {
    columnChartOptions(){
      const jdaGrowthNumbers = _.map(_.get(this.dashboardData, 'periodsData'), v =>{
        return _.toNumber(_.get(v, 'metrics.jdaGrowth'))
      });
      const msGrowthNumbers = _.map(_.get(this.dashboardData, 'periodsData'), v =>{
        return _.toNumber(_.get(v, 'metrics.marketSensingGrowth'))
      })
      const jdaMax = _.max(jdaGrowthNumbers);
      const jdaMin = _.min(jdaGrowthNumbers);
      const msMax = _.max(msGrowthNumbers);
      const msMin = _.min(msGrowthNumbers);
      let maxY = _.max([jdaMax, msMax]);
      let minY = _.min([jdaMin, msMin]);
      if (!(_.isNumber(maxY) && _.isFinite(maxY))){
        maxY = 0
      }
      if (!(_.isNumber(minY) && _.isFinite(minY))){
        minY = 0
      }

      return {
        height: 320,
        explorer: {
          axis: 'horizontal',
        },
        legend: { position: 'bottom', alignment: 'center' },
        tooltip: { trigger: 'none' },
        colors: ['#787878', '#B991EB'],
        hAxis: {
          textStyle: {
            fontSize: 12,
          },
        },
        vAxis: {
          format: '#\'%\''
        },
        chartArea: {
          width: '90%',
        },
        annotations: {
          textStyle: {
            color: '#000000',
            fontSize: 12,
          },
          datum: { stem: { length: 0 } },
          alwaysOutside: true,
        }
      }
    },
    horizonSelection(){
      return _.get(_.find(
        _.get(this.dashboardData, 'periodsData'),
        (v) => v.isActive
      ), "horizon");
    },
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
    columnChartData() {
      const toReturn = [];
      toReturn.push([
        'period',
        'Internal',
        { role: 'annotation' },
        'Actual',
        { role: 'annotation' },
      ]);
      _.forEach(this.dashboardData.periodsData, function (v) {
        const internalGrowthApiVal = _.get(v, "metrics.jdaGrowth", "");
        let internalGrowthVal = null;
        if (typeof internalGrowthApiVal !== 'string'){
          internalGrowthVal = internalGrowthApiVal
        }
        const msGrowthApiVal = _.get(v, "metrics.marketSensingGrowth", "");
        let msGrowthVal = null;
        if (typeof msGrowthApiVal !== 'string'){
          msGrowthVal = msGrowthApiVal
        }
        internalGrowthVal = internalGrowthVal === null ? 0 : internalGrowthVal;
        msGrowthVal = msGrowthVal === null ? 0 : msGrowthVal

        toReturn.push([
          _.get(v, "label", ""),
          internalGrowthVal,
          internalGrowthVal + "%",
          msGrowthVal,
          msGrowthVal + "%",
        ]);
      });
      return toReturn;
    }
  },
  methods: {
    lodGetNumeric(obj, path, isPercentValue = true) {
      const val = _.get(obj, path, null);
      if (val === null || _.isNaN(val) || !_.isNumber(val)) {
        return 'NA';
      }
      return `${val}${isPercentValue ? '%' : ''}`;
    },
    getColorCode(num) {
      const n = _.toNumber(_.replace(num, "%", ''));
      if (Math.abs(n) >= 20) {
        return '#DC3545';
      }
      if (Math.abs(n) >= 6) {
        return '#FF9900';
      }
      return '#04BB46';
    },
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
          customers: this.selectedFilters.customer,
          valueORvolume: this.selectedFilters.valueOrQuantity,
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
        console.error(e);
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
          customer: selectedCustomers === ALL_OPTION ? '*' : selectedCustomers,
          valueOrQuantity: selectedValueORvolume,
        };

        this.fetchDashboardData();
      } catch (e) {
        console.error(e);
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
          class="desktop:tw-text-xl small-laptop:tw-text-xl tw-text-xl tw-font-bold"
        >
          Demand Forecast For Next Six Months
        </h1>
      </div>
      <v-card
        style="height: 770px"
        v-if="lodGet(dashboardData, 'periodsData.length')"
      >
        <div class="tw-flex tw-mt-3" style='padding: 0 70px'>
          <div v-for="periodData in dashboardData.periodsData"
               :key="periodData.horizon"
               class="tw-flex-auto tw-w-full" style="text-align: center"
          >
            <VarianceAction :data="periodData" :options="{
            isModelAccuracyHidden,
            selectedFilters,
            userData: { userId, userDisplayName },
            forecastPeriodType,
          }"/>
          </div>
        </div>
        <GChart
          type="ColumnChart"
          :data="columnChartData"
          :options="columnChartOptions"
          height="370"
        />
        <div class="tw-flex tw-mt-3 tw-flex-col">
          <div
            class="tw-flex tw-flex-col tw-w-full tw-border-b tw-border-solid tw-border-brand-gray-2"
          >
            <h1
              class="desktop:tw-text-xl small-laptop:tw-text-xl tw-text-xl tw-font-bold"
            >
              Additional Details Of The Forecast Model
            </h1>
          </div>
          <div class="tw-flex tw-w-full">
            <v-radio-group
              v-if="dashboardData.periodsData.length > 0"
              v-model="horizonSelection"
              inline
              direction="horizontal"
              class="tw-flex tw-w-full tw-bg-brand-gray-1"
            >
              <v-radio
                v-for="(periodData, index) in dashboardData.periodsData"
                :key="periodData.horizon"
                :label="periodData.horizon"
                :value="periodData.horizon"
                @click="setActiveCard(index)"
              ></v-radio>
            </v-radio-group>
          </div>

          <div style="width: 80%; height: 250px; margin: 0 auto; display: flex; flex-direction: row; padding-top: 10px">
            <div style="width: 50%">
              <ChartKeyDemandDrivers
                v-if="activePeriodData"
                :data="activePeriodData.metrics.keyDemandDrivers"
                :horizon="activePeriodData.horizon"
                :selectedFilters="selectedFilters"
              />
            </div>
            <div class="tw-flex tw-flex-col" style="width: 50%;">
              <div
                class="tw-flex tw-justify-center tw-w-full tw-flex-col tw-items-center"
              >
                <ModelAccuracySection
                  :marketSensingRefreshDate="selectedFilters.marketSensingRefreshDate"
                  :category="selectedFilters.category"
                  :horizon="activePeriodData.horizon"
                  :forecastPeriodType="forecastPeriodType"
                />
              </div>
            </div>
          </div>
        </div>
      </v-card>
      <ActionForm
        v-if="actionFormIsShown"
        :actionFormIsShown="actionFormIsShown"
        :variance="clickedVariance"
        :reviews="reviews"
        :actionStatus="actionStatus"
        :isFetching="isFetchingReviews"
        :isSubmitting="isSubmittingReview"
        :responseSubmitted="responseSubmitted"
        @close-form="hideFormHandler"
        @fetch-reviews="fetchReviews"
        @submit-review="submitHandler"
      />
<!--      <div-->
<!--        class="tw-p-4 desktop:tw-p-1 tw-border tw-border-solid tw-border-brand-primary"-->
<!--      >-->
<!--        <ChartsSection-->
<!--          v-if="activePeriodData"-->
<!--          :activePeriodData="activePeriodData"-->
<!--          :options="{-->
<!--            selectedFilters,-->
<!--            forecastPeriodType,-->
<!--          }"-->
<!--        />-->
<!--      </div>-->
    </div>
    <div v-if="!dataLoading && error">
      <v-alert type="error" :text="error.toString()"></v-alert>
    </div>
  </div>
</template>
<style>
.v-input__control {
  width: 80%;
  margin: 0 auto;
}
.v-selection-control-group--inline {
  justify-content: space-evenly;
}
</style>
