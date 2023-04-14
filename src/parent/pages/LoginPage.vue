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
      <div class="tw-col-span-6 tw-col-start-7 tw-px-20">
        <div class="tw-flex tw-flex-col tw-h-full">
          <h1 class="tw-text-4xl tw-text-black tw-font-medium">
            Kearney’s Sensing Solution
          </h1>
          <div class="tw-py-6">
            <img
              class="kearney-infographic-image"
              :src="kearneyInfographicImage"
            />
          </div>
          <p class="tw-text-lg tw-text-black tw-break-words">
            Demand Dashboard uses rigorous analytics to project demand growth
            and compare against internal forecasts. The goal is to help users
            identify “triggers” to review projection calibration.
          </p>
          <div class="tw-pt-8">
            <LoginButton
              label="Proceed to Sign In"
              type="primary"
              @click="handleLoginIn"
            />
          </div>
        </div>
      </div>
    </div>
    <footer class="footer">
      <div class="footer-copy-right">Copyright @ Kearney 2023</div>
    </footer>
  </section>
</template>

<style scoped>
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
.footer {
  display: flex;
  width: 100%;
  height: 3rem;
  padding-left: 1rem;
  padding-right: 1rem;
  border-top-width: 1px;
  border-style: solid;
  --tw-border-opacity: 1;
  border-color: rgb(219 219 219 / var(--tw-border-opacity));
}
.footer-copy-right {
  margin-left: auto;
  display: flex;
  align-items: center;
}
</style>
