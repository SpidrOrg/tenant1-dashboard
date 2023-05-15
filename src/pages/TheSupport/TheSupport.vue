<script>
import HelpAndSupportImage from '@/images/HelpAndSupport.svg';
export default {
  name: 'TheSupport',
  data() {
    return {
      HelpAndSupportImage,
      supportEmail: 'arjun.shyamsundar@kearney.com',
    };
  },
};
</script>

<template>
  <div class="tw-h-full tw-w-full tw-bg-brand-gray-1">
    <div
      class="tw-flex tw-w-full tw-bg-brand-gray-1 tw-border-b tw-border-solid tw-border-brand-gray-2"
    >
      <div class="tw-flex tw-items-center">
        <h1 class="tw-text-lg tw-font-bold">Help & Support</h1>
      </div>
    </div>
    <div class="tw-w-full tw-p-5 tw-my-5 tw-bg-white">
      <div class="tw-w-full tw-border-b tw-border-solid tw-border-brand-gray-2">
        <h2 class="tw-text-xl">
          Get help getting started, with features and settings, and technical
          support.
        </h2>
      </div>
      <div class="tw-grid tw-grid-cols-2 tw-w-full tw-py-5">
        <div class="tw-col-span-1">
          <div class="tw-flex tw-flex-col tw-gap-y-6 tw-py-5">
            <div class="tw-flex tw-flex-col tw-gap-3">
              <span class="tw-text-base tw-text-black tw-font-medium"
                >For any queries, email at:</span
              >
              <div class="tw-flex tw-gap-x-4 tw-items-center">
                <v-icon
                  icon="mdi-email-outline"
                  class="tw-text-brand-primary"
                  :size="32"
                />
                <a
                  :href="`mailto:${supportEmail}`"
                  class="tw-text-xl tw-text-black tw-underline"
                >
                  {{ supportEmail }}
                </a>
              </div>
            </div>
            <div class="tw-flex tw-flex-col tw-gap-3">
              <span class="tw-text-base tw-text-black tw-font-medium"
                >Read through the User Guide to know more:</span
              >
              <div>
                <button
                  class="tw-px-2 tw-py-1.5 tw-border-2 tw-border-solid tw-border-brand-primary"
                >
                  <div class="tw-flex tw-gap-x-2 tw-items-center">
                    <v-icon
                      icon="mdi-tray-arrow-down"
                      class="tw-text-brand-primary"
                      :size="24"
                    />
                    <span class="tw-text-base tw-text-black">
                      Download User Guide
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="tw-col-span-1">
          <div class="tw-h-full tw-w-full tw-px-4">
            <img
              :src="HelpAndSupportImage"
              class="tw-h-full tw-w-full tw-object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
