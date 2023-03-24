<script>
import _ from 'lodash';

const ACTION_STATUS_LIST = [
  { id: 1, label: 'Pending Action' },
  { id: 2, label: 'Reviewed and Action has been taken' },
  { id: 3, label: 'Reviewed and Action has not been taken' },
];

let RESPONSES = [
  {
    id: 1,
    name: 'Morty Smith',
    date: 'Feb 8, 2023',
    text: 'We need to review this with the team.',
  },
  {
    id: 2,
    name: 'Rick Sanchez',
    date: 'Feb 10, 2023',
    text: 'We have reviewed this forecast variance with management team on Feb 7. On the basis of conclusion of that meeting we agreed on the forecast and decided that no further action is required.',
  },
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
    isReviewed: {
      type: Boolean,
      required: true,
    },
  },
  emits: ['closeForm', 'submitted'],
  data() {
    return {
      actionStatus: 1,
      userResponse: null,
      ACTION_STATUS_LIST,
      RESPONSES,

      lodMap: _.map,
      lodGet: _.get,
      lodFind: _.find,
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
      this.actionStatus = this.lodGet(
        this.lodFind(ACTION_STATUS_LIST, (item) => item.label === label),
        'id'
      );
    },
    isSubmitButtonDisabled() {
      return !(this.userResponse && this.actionStatus);
    },
    submitHandler() {
      const latestId = RESPONSES[RESPONSES.length - 1]?.id + 1 || 1;
      const newItem = {
        id: latestId,
        name: 'Maximilian Schwarzmüller',
        date: new Date().toLocaleDateString('en-us', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
        text: this.userResponse,
      };
      RESPONSES.push(newItem);
      this.userResponse = null;
      this.$emit('submitted');
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
          <div class="tw-flex tw-flex-col tw-gap-y-7">
            <div
              v-for="response in RESPONSES"
              :key="response.id"
              class="tw-flex tw-flex-col tw-gap-y-2"
            >
              <div class="tw-flex tw-justify-between">
                <span class="tw-text-base tw-font-medium tw-text-black">{{
                  response.name
                }}</span>
                <span class="tw-text-base tw-text-brand-gray-3">{{
                  response.date
                }}</span>
              </div>
              <p>{{ response.text }}</p>
            </div>
          </div>
        </div>
        <div
          class="tw-col-span-1 tw-p-4 tw-border-2 tw-border-solid tw-border-brand-secondary-10"
        >
          <div class="tw-w-full tw-h-3/5">
            <label for="response">Add Your Response</label>
            <textarea
              id="response"
              v-model="userResponse"
              placeholder="Please mention action items"
              class="tw-w-full tw-h-3/4 tw-max-h-72 tw-text-base tw-py-2 tw-px-4 tw-border-2 tw-border-solid tw-border-brand-secondary-20"
            />
          </div>
          <div>
            <label for="status">Recommended Action Status</label>
            <v-select
              id="status"
              :model-value="
                lodGet(
                  lodFind(
                    ACTION_STATUS_LIST,
                    (item) => item.id === actionStatus
                  ),
                  'label'
                )
              "
              :items="lodMap(ACTION_STATUS_LIST, (item) => item.label)"
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
          v-if="isReviewed"
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
