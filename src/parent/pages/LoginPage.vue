<script>
import KearneyHomeLogo from '../public/kearneyHomeLogo.png';
import kearneyInfographicImage from '../public/kearneyInfographic.png';
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
      kearneyInfographicImage,
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
  <section class="tw-flex tw-h-screen tw-flex-col">
    <div class="tw-grid tw-grid-cols-12 tw-my-auto">
      <div
        class="tw-col-span-6 tw-col-start-1 tw-self-center tw-justify-self-center"
      >
        <img class="kearney-home-logo" :src="KearneyHomeLogo" />
      </div>
      <div
        class="tw-col-span-6 tw-col-start-7 tw-px-20 desktop:tw-px-10 small-laptop:tw-px-10"
      >
        <div class="tw-flex tw-flex-col tw-justify-center tw-h-full">
          <h1
            class="tw-text-4xl desktop:tw-text-3xl small-laptop:tw-text-xl tw-text-black tw-font-medium"
          >
            Kearney’s Sensing Solution
          </h1>
          <div class="tw-py-6 desktop:tw-py-2 small-laptop:tw-py-1">
            <img
              class="kearney-infographic-image"
              :src="kearneyInfographicImage"
            />
          </div>
          <p
            class="tw-text-lg desktop:tw-text-base small-laptop:tw-text-sm tw-text-black tw-break-words"
          >
            Demand Dashboard uses rigorous analytics to project demand growth
            and compare against internal forecasts. The goal is to help users
            identify “triggers” to review projection calibration.
          </p>
          <div class="tw-pt-8 small-laptop:tw-pt-5 small-laptop:tw-pb-2">
            <LoginButton
              label="Proceed to Sign In"
              type="primary"
              @click="handleLoginIn"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="tw-px-5">
      <footer
        class="tw-w-full tw-flex tw-p-4 tw-border-t tw-border-solid tw-border-brand-gray-2"
      >
        <div class="tw-ml-auto tw-flex tw-items-center">
          Copyright @ Kearney 2023
        </div>
      </footer>
    </div>
  </section>
</template>

<style scoped>
@media screen and (max-width: 1440px) {
  .kearney-home-logo {
    height: 550px;
    width: 430px;
    object-fit: contain;
  }
  .kearney-infographic-image {
    height: 320px;
    width: 480px;
    object-fit: contain;
  }
}

@media screen and (min-width: 1441px) {
  .kearney-home-logo {
    height: 708px;
    width: 630px;
    object-fit: contain;
  }
  .kearney-infographic-image {
    height: 456px;
    width: 706px;
    object-fit: contain;
  }
}
</style>
