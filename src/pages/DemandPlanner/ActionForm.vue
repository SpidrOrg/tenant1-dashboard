<script>
import getReviews from '@/api/DemandPlanner/getReviews';
import { ACTION_STATUS_LABELS, NUMERIC_MONTH_MAP } from './constants';

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

// let RESPONSES = [
//   {
//     id: 1,
//     name: 'Morty Smith',
//     date: 'Feb 8, 2023',
//     text: 'We need to review this with the team.',
//   },
//   {
//     id: 2,
//     name: 'Rick Sanchez',
//     date: 'Feb 10, 2023',
//     text: 'We have reviewed this forecast variance with management team on Feb 7. On the basis of conclusion of that meeting we agreed on the forecast and decided that no further action is required.',
//   },
// ];

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
    selectedFilters: {
      type: Object,
      required: true,
    },
    period: {
      type: String,
      required: true,
    },
  },
  emits: ['closeForm', 'reviewed'],
  data() {
    return {
      isFetching: false,
      error: null,
      reviews: [],
      actionStatus: PENDING_ACTION,
      userResponse: null,
      ACTION_STATUS_LIST,
      responseSubmitted: false,
    };
  },
  methods: {
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
      return !(this.userResponse && this.actionStatus);
    },
    submitHandler() {
      // const latestId = RESPONSES[RESPONSES.length - 1]?.id + 1 || 1;
      // const newItem = {
      //   id: latestId,
      //   name: 'Maximilian Schwarzmüller',
      //   date: new Date().toLocaleDateString('en-us', {
      //     year: 'numeric',
      //     month: 'short',
      //     day: 'numeric',
      //   }),
      //   text: this.userResponse,
      // };
      // RESPONSES.push(newItem);
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
    },
  },
  computed: {
    periodStartDate() {
      const [month, yearShortForm] = this.period
        .split('-')[0]
        .trim()
        .split(' ');
      const numericMonth = NUMERIC_MONTH_MAP[month];
      return `20${yearShortForm}-${numericMonth}-01`;
    },
    periodEndDate() {
      const [month, yearShortForm] = this.period
        .split('-')[1]
        .trim()
        .split(' ');
      const numericMonth = NUMERIC_MONTH_MAP[month];
      return `20${yearShortForm}-${numericMonth}-01`;
    },
  },
  async created() {
    this.isFetching = true;
    try {
      this.reviews = await getReviews({
        refreshDate: this.selectedFilters.marketSensingRefreshDate,
        customer: this.selectedFilters.customer.replaceAll("'", "\\'"),
        category: this.selectedFilters.category,
        valueOrQuantity: this.selectedFilters.selectedValueORvolume,
        periodStart: this.periodStartDate,
        periodEnd: this.periodEndDate,
      });
    } catch (e) {
      this.error = e;
    }
    this.isFetching = false;
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
          <div v-if="isFetching">Fetching Reviews...</div>
          <div class="tw-flex tw-flex-col tw-gap-y-7" v-else>
            <div
              v-for="review in reviews"
              :key="review.id"
              class="tw-flex tw-flex-col tw-gap-y-2"
            >
              <div class="tw-flex tw-justify-between">
                <span class="tw-text-base tw-font-medium tw-text-black">{{
                  review.name
                }}</span>
                <span class="tw-text-base tw-text-brand-gray-3">{{
                  review.date
                }}</span>
              </div>
              <p>{{ review.text }}</p>
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
      <div class="tw-flex tw-gap-x-4 tw-pt-4">
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
          class="tw-px-4 tw-py-2 tw-flex tw-items-center tw-gap-x-2 tw-border-2 tw-border-solid tw-border-brand-green-1 tw-rounded-sm tw-bg-brand-green-3"
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
