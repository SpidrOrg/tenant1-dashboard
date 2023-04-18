<script>
import _ from 'lodash';
import { getPeriodStartDate, getPeriodEndDate } from '@/utils/dateHelpers';
import getReviews from '@/api/DemandPlanner/getReviews';
import addReview from '@/api/DemandPlanner/addReview';
import { ACTION_STATUS_LABELS, FORECAST_PERIOD_TYPES } from './constants';

import ModelAccuracySection from './ModelAccuracySection/ModelAccuracySection.vue';
import ActionButton from './ActionButton.vue';
import ActionForm from './ActionForm.vue';

const {
  PENDING_ACTION,
  REVIEWED_AND_ACTION_TAKEN,
  REVIEWED_AND_ACTION_NOT_TAKEN,
} = ACTION_STATUS_LABELS;

export default {
  name: 'CardsListItem',
  components: {
    ModelAccuracySection,
    ActionButton,
    ActionForm,
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
    options: Object,
  },
  data() {
    return {
      reviews: [],
      actionFormIsShown: false,
      actionStatus: PENDING_ACTION,
      isReviewed: false,

      isFetchingReviews: true,
      getReviewsError: null,
      isSubmittingReview: false,
      submitReviewError: null,
      responseSubmitted: false,
    };
  },
  computed: {
    isModelAccuracyHidden() {
      return this.options.isModelAccuracyHidden || false;
    },
    selectedFilters() {
      return _.get(this.options, 'selectedFilters');
    },
    userData() {
      return _.get(this.options, 'userData');
    },
    period() {
      return _.get(this.data, 'period');
    },
    periodStartDate() {
      return getPeriodStartDate(this.period);
    },
    periodEndDate() {
      return getPeriodEndDate(this.period);
    },
    variance() {
      return _.toNumber(
        this.lodGetNumeric(this.data, 'metrics.variance', false)
      );
    },
    horizon() {
      return _.get(this.data, 'horizon');
    },
    forecastPeriodType() {
      return _.get(this.options, 'forecastPeriodType');
    },
    periodLabel() {
      return _.get(this.data, 'label');
    },
    formattedHorizon() {
      if (this.forecastPeriodType === FORECAST_PERIOD_TYPES.R3M_VIEW) {
        return _.get(this.data, 'formattedHorizon');
      }
      return '';
    },
  },
  methods: {
    showFormHandler() {
      this.actionFormIsShown = true;
    },
    hideFormHandler() {
      this.actionFormIsShown = false;
    },
    lodGetNumeric(obj, path, isPercentValue = true) {
      const val = _.get(obj, path, null);
      if (val === null || _.isNaN(val) || !_.isNumber(val)) {
        return 'NA';
      }
      return `${val}${isPercentValue ? '%' : ''}`;
    },
    getColorCode(num) {
      const n = _.toNumber(num);
      if (Math.abs(n) >= 20) {
        return '#DC3545';
      }
      if (Math.abs(n) >= 6) {
        return '#FF9900';
      }
      return '#04BB46';
    },
    handleSuccessfulSubmission() {
      this.responseSubmitted = true;
      setTimeout(() => {
        this.responseSubmitted = false;
      }, 5000);

      this.fetchReviews();
    },
    async submitHandler({ selectedAction, userResponse }) {
      this.isSubmittingReview = true;
      try {
        await addReview({
          userId: _.get(this.userData, 'userId'),
          userDisplayName: _.get(this.userData, 'userDisplayName'),
          action: selectedAction,
          asOn: this.selectedFilters.marketSensingRefreshDate,
          comment: userResponse,
          periodStartDate: this.periodStartDate,
          periodEndDate: this.periodEndDate,
          customer: this.selectedFilters.customer,
          category: this.selectedFilters.category,
          byValueOrByVolume: this.selectedFilters.valueOrQuantity,
          forecastPeriodType: this.forecastPeriodType,
        });

        this.handleSuccessfulSubmission();
      } catch (error) {
        this.submitReviewError = error;
      }
      this.isSubmittingReview = false;
    },
    async fetchReviews() {
      this.isFetchingReviews = true;
      try {
        this.reviews = await getReviews({
          refreshDate: this.selectedFilters.marketSensingRefreshDate,
          customer: this.selectedFilters.customer,
          category: this.selectedFilters.category,
          valueOrQuantity: this.selectedFilters.valueOrQuantity,
          periodStart: this.periodStartDate,
          periodEnd: this.periodEndDate,
          forecastPeriodType: this.forecastPeriodType,
        });

        this.actionStatus = _.get(this.reviews, '[0].action');
        if (
          this.actionStatus === REVIEWED_AND_ACTION_TAKEN ||
          this.actionStatus === REVIEWED_AND_ACTION_NOT_TAKEN
        ) {
          this.isReviewed = true;
        } else {
          this.isReviewed = false;
        }
      } catch (e) {
        this.getReviewsError = e;
      }
      this.isFetchingReviews = false;
    },
  },
  created() {
    this.fetchReviews();
  },
};
</script>

<template>
  <div class="tw-w-full tw-h-full tw-px-3 tw-py-1">
    <div class="tw-flex tw-flex-col tw-py-2">
      <p style="color: #9291a5">Projected Period</p>
      <div class="tw-flex tw-gap-x-4 tw-items-center tw-w-full">
        <p class="tw-text-lg tw-font-medium">{{ periodLabel }}</p>
        <div
          class="tw-bg-brand-gray-4 tw-rounded tw-text-center"
          v-if="formattedHorizon"
        >
          <p class="tw-p-1 tw-text-sm">Future {{ formattedHorizon }} months</p>
        </div>
      </div>
    </div>
    <div class="tw-w-full tw-border-t tw-border-solid tw-border-brand-gray-2" />
    <div
      :class="`tw-grid tw-py-2 ${
        isModelAccuracyHidden ? 'tw-grid-cols-3' : 'tw-grid-cols-5'
      }`"
    >
      <div class="tw-col-span-3">
        <v-menu open-on-hover location="top">
          <template v-slot:activator="{ props }">
            <p v-bind="props" class="tw-text-sm tw-font-medium">
              Projected Growth (%YoY)
            </p>
          </template>
          <div
            class="tw-w-52 tw-h-14 tw-p-2 tw-bg-white tw-border tw-rounded tw-border-[#D9D9D9] tw-shadow-2xl"
          >
            <p class="tw-text-sm tw-text-center">
              The % increase in demand the company expects.
            </p>
          </div>
        </v-menu>
        <div class="tw-grid tw-grid-cols-2 tw-pt-4">
          <v-menu open-on-hover location="top">
            <template v-slot:activator="{ props }">
              <div v-bind="props" class="tw-text-center">
                <p class="tw-text-2xl tw-font-semibold">
                  {{ `${lodGetNumeric(data, 'metrics.jdaGrowth')}` }}
                </p>
                <p class="tw-text-xs">Planned Internal Forecast</p>
              </div>
            </template>
            <div
              class="tw-w-80 tw-h-14 tw-p-2 tw-bg-white tw-border tw-rounded tw-border-[#D9D9D9] tw-shadow-2xl"
            >
              <p class="tw-text-sm tw-text-center">
                Internal market demands at a category level determined by
                internal historical data.
              </p>
            </div>
          </v-menu>
          <v-menu open-on-hover location="top">
            <template v-slot:activator="{ props }">
              <div v-bind="props" class="tw-text-center">
                <p class="tw-text-2xl tw-font-semibold">
                  {{ `${lodGetNumeric(data, 'metrics.marketSensingGrowth')}` }}
                </p>
                <p class="tw-text-xs">Market Sensing Model Forecast</p>
              </div>
            </template>
            <div
              class="tw-w-96 tw-h-20 tw-p-2 tw-bg-white tw-border tw-rounded tw-border-[#D9D9D9] tw-shadow-2xl"
            >
              <p class="tw-text-sm tw-text-center">
                Highly accurate market demand projections at a category level
                based on ML models that analyze and learn from internal and
                external data feeds
              </p>
            </div>
          </v-menu>
        </div>
      </div>
      <div
        class="tw-flex tw-flex-col tw-items-center tw-col-span-2"
        v-if="!isModelAccuracyHidden"
      >
        <ModelAccuracySection
          :marketSensingRefreshDate="
            this.selectedFilters.marketSensingRefreshDate
          "
          :category="this.selectedFilters.category"
          :horizon="horizon"
          :forecastPeriodType="forecastPeriodType"
        />
      </div>
    </div>
    <div
      class="tw-w-full tw-flex tw-justify-center tw-items-center tw-gap-3 tw-pt-2"
    >
      <v-menu open-on-hover location="top">
        <template v-slot:activator="{ props }">
          <div v-bind="props" class="tw-flex tw-flex-col tw-items-center">
            <span
              class="tw-text-4xl tw-font-semibold"
              :style="{ color: getColorCode(variance) }"
            >
              {{ `${lodGetNumeric(data, 'metrics.variance')}` }}
            </span>
            <span class="tw-text-xs">Variance</span>
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
      <div>
        <ActionButton
          :variance="variance"
          :isReviewed="isReviewed"
          :isFetchingReviews="isFetchingReviews"
          @click="showFormHandler"
        />
      </div>
    </div>
    <ActionForm
      v-if="actionFormIsShown"
      :actionFormIsShown="actionFormIsShown"
      :variance="variance"
      :reviews="reviews"
      :actionStatus="actionStatus"
      :isFetching="isFetchingReviews"
      :isSubmitting="isSubmittingReview"
      :responseSubmitted="responseSubmitted"
      @close-form="hideFormHandler"
      @fetch-reviews="fetchReviews"
      @submit-review="submitHandler"
    />
  </div>
</template>
