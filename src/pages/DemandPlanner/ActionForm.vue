<script>
import _ from 'lodash';
import { format as formatFn } from 'date-fns';
import addReview from '@/api/DemandPlanner/addReview';
import getReviews from '@/api/DemandPlanner/getReviews';
import { ACTION_STATUS_LABELS } from './constants';

const {
  PENDING_ACTION,
  REVIEWED_AND_ACTION_TAKEN,
  REVIEWED_AND_ACTION_NOT_TAKEN,
} = ACTION_STATUS_LABELS;

const ACTION_STATUS_LIST = [
  PENDING_ACTION,
  REVIEWED_AND_ACTION_TAKEN,
  REVIEWED_AND_ACTION_NOT_TAKEN,
];

export default {
  name: 'ActionForm',
  props: {
    actionFormIsShown: {
      type: Boolean,
      required: true,
    },
    initialReviews: {
      type: Array,
      required: true,
    },
    variance: {
      type: Number,
      required: true,
    },
    userData: {
      type: Object,
      required: true,
    },
    selectedFilters: {
      type: Object,
      required: true,
    },
    periodStartDate: {
      type: String,
      required: true,
    },
    periodEndDate: {
      type: String,
      required: true,
    },
  },
  emits: ['closeForm', 'reviewed'],
  data() {
    return {
      isFetching: false,
      isSubmitting: false,
      error: null,
      reviews: [],
      actionStatus: PENDING_ACTION,
      userResponse: null,
      ACTION_STATUS_LIST,
      responseSubmitted: false,
      lodGet: _.get,
    };
  },
  methods: {
    formatDate(dateString, format = 'yyyy-MM-dd') {
      return formatFn(new Date(dateString), format);
    },
    getStatus(n) {
      if (Math.abs(n) >= 20) {
        return 'Review';
      }
      if (Math.abs(n) >= 6) {
        return 'Watch List';
      }
      return 'No Action';
    },
    updateActionStatus(label) {
      this.actionStatus = label;
    },
    isSubmitButtonDisabled() {
      return !(this.userResponse && this.actionStatus) || this.isSubmitting;
    },
    async fetchReviews() {
      this.isFetching = true;
      try {
        this.reviews = await getReviews({
          refreshDate: this.selectedFilters.marketSensingRefreshDate,
          customer: this.selectedFilters.customer.replaceAll("'", "\\'"),
          category: this.selectedFilters.category,
          valueOrQuantity: this.selectedFilters.valueOrQuantity,
          periodStart: this.periodStartDate,
          periodEnd: this.periodEndDate,
        });
      } catch (e) {
        this.error = e;
      }
      this.isFetching = false;
    },
    handleSuccessfulSubmission() {
      this.userResponse = null;
      this.responseSubmitted = true;
      setTimeout(() => {
        this.responseSubmitted = false;
      }, 5000);

      if (
        this.actionStatus === REVIEWED_AND_ACTION_TAKEN ||
        this.actionStatus === REVIEWED_AND_ACTION_NOT_TAKEN
      ) {
        this.$emit('reviewed');
      }

      this.fetchReviews();
    },
    async submitHandler() {
      this.isSubmitting = true;
      try {
        await addReview({
          userId: _.get(this.userData, 'userId'),
          userDisplayName: _.get(this.userData, 'userDisplayName'),
          action: this.actionStatus,
          asOn: this.selectedFilters.marketSensingRefreshDate,
          comment: this.userResponse,
          periodStartDate: this.periodStartDate,
          periodEndDate: this.periodEndDate,
          customer: this.selectedFilters.customer,
          category: this.selectedFilters.category,
          byValueOrByVolume: this.selectedFilters.valueOrQuantity,
          forecastPeriodType: 'r3m',
        });

        this.handleSuccessfulSubmission();
      } catch (error) {
        this.error = error;
      }
      this.isSubmitting = false;
    },
  },
  created() {
    this.reviews = this.initialReviews;
  },
};
</script>

<template>
  <v-dialog :model-value="actionFormIsShown" width="auto" persistent>
    <div class="tw-w-full tw-bg-white tw-p-3 tw-overflow-auto">
      <h1 class="tw-text-lg tw-font-bold tw-pb-3">
        Recommended Action - {{ getStatus(variance) }} Status
      </h1>
      <div class="tw-grid tw-grid-cols-2" style="height: 580px; width: 1080px">
        <div
          class="tw-col-span-1 tw-py-3 tw-px-4 tw-border-2 tw-border-solid tw-border-brand-secondary-10 tw-overflow-auto"
        >
          <div
            v-if="isFetching"
            class="tw-w-full tw-h-3/4 tw-flex tw-justify-center tw-items-center"
          >
            <v-progress-circular
              indeterminate
              color="#7823DC"
              :size="60"
              :width="10"
            />
          </div>
          <div class="tw-flex tw-flex-col tw-gap-y-7" v-else>
            <div
              v-for="review in reviews"
              :key="lodGet(review, 'id')"
              class="tw-flex tw-flex-col tw-gap-y-2"
            >
              <div class="tw-flex tw-justify-between">
                <span class="tw-text-base tw-font-medium tw-text-black">{{
                  lodGet(review, 'user_display_name')
                }}</span>
                <span class="tw-text-base tw-text-brand-gray-3">{{
                  formatDate(lodGet(review, 'date'), 'MMM dd, yyyy')
                }}</span>
              </div>
              <p>{{ lodGet(review, 'comment') }}</p>
            </div>
          </div>
        </div>
        <div
          class="tw-col-span-1 tw-p-4 tw-border-2 tw-border-solid tw-border-brand-secondary-10"
        >
          <div class="tw-w-full tw-h-3/5">
            <label for="review">Add Your Response</label>
            <textarea
              id="review"
              v-model="userResponse"
              placeholder="Please mention action items"
              class="tw-w-full tw-h-3/4 tw-max-h-72 tw-text-base tw-py-2 tw-px-4 tw-border-2 tw-border-solid tw-border-brand-secondary-20"
            />
          </div>
          <div>
            <label for="status">Recommended Action Status</label>
            <v-select
              id="status"
              :model-value="actionStatus"
              :items="ACTION_STATUS_LIST"
              @update:modelValue="(value) => updateActionStatus(value)"
              density="comfortable"
            />
          </div>
        </div>
      </div>
      <div class="tw-flex tw-items-center tw-gap-x-4 tw-pt-4">
        <button
          :class="`tw-px-6 tw-py-2 ${
            isSubmitButtonDisabled()
              ? 'tw-bg-brand-primary-disabled'
              : 'tw-bg-brand-primary'
          }`"
          :disabled="isSubmitButtonDisabled()"
          @click="submitHandler"
        >
          <span class="tw-text-white tw-text-base">Save Updates</span>
        </button>
        <div
          v-if="responseSubmitted"
          class="tw-px-4 tw-py-1 tw-flex tw-items-center tw-gap-x-2 tw-border-2 tw-border-solid tw-border-brand-green-1 tw-rounded-sm tw-bg-brand-green-3"
        >
          <v-icon icon="mdi-check-circle" color="#04BB46" />
          <span class="tw-text-brand-green-1 tw-text-base"
            >Updated Successfully</span
          >
        </div>
        <button
          class="tw-px-4 tw-py-2 tw-bg-brand-gray-3 tw-ml-auto"
          @click="$emit('closeForm')"
        >
          <span class="tw-text-white tw-text-base">Close</span>
        </button>
      </div>
    </div>
  </v-dialog>
</template>
