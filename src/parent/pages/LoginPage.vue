<script>
import KearneyHomeLogo from '../public/kearneyHomeLogo.png';
import LoginButton from '../components/LoginButton.vue';
import { doFederatedSignIn } from '../idpUtils';

export default {
  name: 'LoginPage',
  components: {
    LoginButton,
  },
  data() {
    return {
      KearneyHomeLogo,
    };
  },
  methods: {
    handleLoginIn() {
      doFederatedSignIn();
    },
  },
};
</script>

<template>
  <section class="tw-flex tw-h-screen tw-flex-col tw-pt-10 tw-pb-20">
    <div class="tw-grid tw-grid-cols-12 tw-my-auto">
      <div class="tw-col-span-1 tw-col-start-1" />
      <div
        class="tw-col-span-5 tw-col-start-2 tw-self-center tw-justify-self-center"
      >
        <img class="imageClass" :src="KearneyHomeLogo" />
      </div>
      <div class="tw-col-span-5 tw-col-start-7 tw-my-auto tw-px-24">
        <div class="tw-flex tw-flex-col">
          <h1 class="tw-text-4xl tw-font-medium tw-pb-8">
            Kearney’s Sensing Solution
          </h1>
          <p class="tw-text-xl tw-break-words tw-pb-8">
            Demand Dashboard compares projected growth for demand against
            expected market demand. The goal is to help users to identify
            “triggers” necessitating review for projection calibration.
          </p>
          <div class="tw-pt-12">
            <LoginButton
              label="Proceed to Sign In"
              type="primary"
              @click="handleLoginIn"
            />
          </div>
        </div>
      </div>
      <div class="tw-col-span-1 tw-col-start-12" />
    </div>
  </section>
</template>

<style scoped>
.imageClass {
  height: 630px;
  width: 571px;
  object-fit: contain;
}
</style>
