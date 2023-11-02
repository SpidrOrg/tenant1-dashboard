<script>
import _ from 'lodash';
import { getPeriodStartDate, getPeriodEndDate } from '@/utils/dateHelpers';
import getReviews from '@/api/DemandPlanner/getReviews';
import addReview from '@/api/DemandPlanner/addReview';
import { ACTION_STATUS_LABELS, FORECAST_PERIOD_TYPES } from '../../DemandPlanner/constants';

import ActionForm from '../../DemandPlanner/ActionForm.vue';

const {
  PENDING_ACTION,
  REVIEWED_AND_ACTION_TAKEN,
  REVIEWED_AND_ACTION_NOT_TAKEN,
} = ACTION_STATUS_LABELS;

export default {
  name: 'VarianceAction',
  components: {
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
    getActionButtonLabel(n) {
      if (this.isFetchingReviews) return 'Loading...';

      if (this.isReviewed) return 'Reviewed';

      if (Math.abs(n) >= 20) {
        return 'Review';
      }
      if (Math.abs(n) >= 6) {
        return 'Watch List';
      }
      return 'No Action';
    },
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
          splits: this.selectedFilters.splits,
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
          splits: this.selectedFilters.splits,
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
  <div class="tw-w-full tw-h-full tw-px-12 tw-py-4">

    <div
      class="tw-w-full tw-flex tw-justify-center tw-items-center tw-gap-3 tw-bg-brand-gray-1 tw-border-brand-gray-1 tw-rounded"

    >
      <v-menu open-on-hover location="top">
        <template v-slot:activator="{ props }">
          <div v-bind="props" class="tw-flex tw-flex-col tw-items-center" @click="showFormHandler"
               :style="`cursor: pointer;`"
          >
            <div
              class="tw-flex tw-flex-col"

            >
              <span
                :style="`color: ${getColorCode(variance)}`"
                class="tw-text-4xl desktop:tw-text-2xl small-laptop:tw-text-lg tw-font-semibold"
              >
              {{ `${lodGetNumeric(data, 'metrics.variance')}` }}
            </span>
              <span class="tw-text-xs desktop:tw-text-xxs small-laptop:tw-text-xxs">Variance</span>
            </div>

            <span class="tw-text-black tw-normal-case tw-font-medium desktop:tw-text-xs small-laptop:xs tw-text-base"
                  :style="`color: ${getColorCode(variance)}`"
            >
      {{ getActionButtonLabel(variance) }}
    </span>
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
