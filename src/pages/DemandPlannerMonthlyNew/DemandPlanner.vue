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
import CardsList from './CardsList.vue';
import ChartsSection from '@/pages/DemandPlanner/ChartsSection/ChartsSection.vue';
import ChartKeyDemandDrivers from "@/pages/DemandPlanner/ChartsSection/ChartKeyDemandDrivers.vue";
import ModelAccuracySection from "@/pages/DemandPlannerMonthlyNew/ModelAccuracySection/ModelAccuracySection.vue";
import ActionForm from "@/pages/DemandPlanner/ActionForm.vue";

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
      lodGet: _.get,
      columnChartOptions: {
        height: 320,
        explorer: {
          axis: 'horizontal',
        },
        legend: { position: 'none' },
        tooltip: { trigger: 'none' },
        colors: ['#787878', '#B991EB'],
        hAxis: {
          textStyle: {
            fontSize: 12,
          },
        },
        vAxis: {
          textPosition: 'none',
          viewWindow: {
            max: 40,
            min: -40,
          },
        },
        chartArea: {
          left: '1%',
          width: '100%',
        },
        annotations: {
          textStyle: {
            color: '#000000',
            fontSize: 12,
          },
          datum: { stem: { length: 0 } },
          alwaysOutside: true,
        }
      },
    };
  },
  computed: {
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
          class="desktop:tw-text-2xl small-laptop:tw-text-2xl tw-text-3xl tw-font-bold"
        >
          Future Demand Forecasting
        </h1>
      </div>
      <v-card
        style="height: 730px"
        v-if="lodGet(dashboardData, 'periodsData.length')"
      >
        <div class="tw-flex tw-mt-3">
          <div v-for="periodData in dashboardData.periodsData"
               :key="periodData.horizon"
               class="tw-flex-auto tw-w-full" style="text-align: center"
          >
            <v-menu open-on-hover location="top">
              <template v-slot:activator="{ props }">
                <div v-bind="props" class="tw-flex tw-flex-col tw-items-center">
            <span
              class="tw-text-4xl desktop:tw-text-2xl small-laptop:tw-text-lg tw-font-semibold"
              :style="{ color: getColorCode(lodGetNumeric(periodData, 'metrics.variance')) }"
            >
              {{ `${lodGetNumeric(periodData, 'metrics.variance')}` }}
            </span>
                  <span class="tw-text-xs desktop:tw-text-xxs small-laptop:tw-text-xxs">Variance</span>
                </div>
              </template>
              <div
                class="tw-w-80 tw-h-20 tw-p-2 tw-bg-white tw-border tw-rounded tw-border-[#D9D9D9] tw-shadow-2xl"
              >
                <p class="tw-text-sm tw-text-center">
                  {{
                    `The difference between market sensing and the internal forecast results in a
              ${lodGetNumeric(data, 'metrics.variance')} variance.`
                  }}
                </p>
              </div>
            </v-menu>
          </div>
        </div>
        <GChart
          type="ColumnChart"
          :data="columnChartData"
          :options="columnChartOptions"
          height="370"
        />
        <div class="tw-flex tw-mt-3 tw-flex-col">
          <div class="tw-flex tw-w-full">
            <v-radio-group
              v-if="dashboardData.periodsData.length > 0"
              v-model="horizonSelection"
              inline
              direction="horizontal"
              class="tw-flex tw-w-full"
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
          <div style="width: 80%; height: 250px; margin: 0 auto; border: 1px solid black; display: flex; flex-direction: row">
            <div style="width: 50%">
              <ChartKeyDemandDrivers
                v-if="activePeriodData"
                :data="activePeriodData.metrics.keyDemandDrivers"
                :horizon="activePeriodData.horizon"
                :selectedFilters="selectedFilters"
              />
            </div>
            <div class="tw-flex" style="width: 50%;">
              <div
                class="tw-flex tw-justify-center tw-w-full tw-flex-col tw-items-center"
                v-if="!isModelAccuracyHidden"
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
