<script>
import KearneyHomeLogo from "../public/kearneyHomeLogo.png";
import LoginButton from "../components/LoginButton.vue";
import {doFederatedSignIn} from "../idpUtils";

export default {
  name: "LoginPage",
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
      doFederatedSignIn()
    },
  },
};
</script>

<template>
  <section class="container">
    <div class="gridContaier">
      <div class="firstColumn"></div>
      <div class="secondColumn">
        <img class="imageClass" :src="KearneyHomeLogo" />
      </div>
      <div class="thirdColumn">
        <div class="welcomeMessageContainer">
          <div style="margin-bottom: 2rem; font-size: x-large; font-weight: 600;">Kearney's Sensing Solution</div>
          <div style="margin-bottom: 2rem">
            Demand Dashboard compares projected growth for demand against
            expected market demand. The goal is to help users to identify
            “triggers” necessitating review for projection calibration.
          </div>
          <div>
            <LoginButton
              label="Sign In"
              type="primary"
              @click="handleLoginIn"
            />
          </div>
        </div>
      </div>
      <div class="fourthColumn"></div>
    </div>
  </section>
</template>

<style scoped>
.container {
  display: flex;
  height: 100vh;
  flex-direction: column;
  padding-top: 2.5rem;
  padding-bottom: 5rem;
}
.gridContaier {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  margin-top: auto;
  margin-bottom: auto;
}
.firstColumn {
  grid-column: span 1 / span 1;
  grid-column-start: 1;
}
.secondColumn {
  grid-column: span 5 / span 5;
  grid-column-start: 2;
  align-self: center;
  justify-self: center;
}
.thirdColumn {
  grid-column: span 5 / span 5;
  grid-column-start: 7;
  margin-top: auto;
  margin-bottom: auto;
  padding-right: 300px;
  padding-left: 100px;
}
.fourthColumn {
  grid-column: span 1 / span 1;
  grid-column-start: 12;
}
.imageClass {
  height: 630px;
  width: 571px;
  object-fit: contain;
}

.welcomeMessageContainer {
  display: flex;
  flex-direction: column;
}
</style>
