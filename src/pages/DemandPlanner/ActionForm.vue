<script>
import _ from 'lodash';
import { format as formatFn } from 'date-fns';
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
    variance: {
      type: Number,
      required: true,
    },
    reviews: {
      type: Array,
      required: true,
    },
    actionStatus: {
      type: String,
      default: PENDING_ACTION,
    },
    isFetching: {
      type: Boolean,
      required: true,
    },
    isSubmitting: {
      type: Boolean,
      required: true,
    },
    responseSubmitted: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['closeForm', 'fetchReviews', 'submitReview'],
  data() {
    return {
      selectedAction: this.actionStatus,
      userResponse: null,
      ACTION_STATUS_LIST,
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
    updateActionStatus(action) {
      this.selectedAction = action;
    },
    isSubmitButtonDisabled() {
      return (
        !(this.userResponse && this.selectedAction) ||
        this.isSubmitting ||
        this.isFetching
      );
    },
    async submitHandler() {
      this.$emit('submitReview', {
        selectedAction: this.selectedAction,
        userResponse: this.userResponse,
      });
      this.userResponse = null;
    },
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
              :model-value="selectedAction"
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
