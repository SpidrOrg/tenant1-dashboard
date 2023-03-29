<script>
import SideBar from "./SideBar.vue";
import TheHeader from "./TheHeader.vue";

export default {
  name: "TheSckeleton",
  components: {
    SideBar,
    TheHeader
  },
  props: {
    orgLogo: {
      type: String,
      required: true
    },
    userdata: {
      type: Object,
      required: false,
      default: {}
    }
  }
}
</script>

<template>
  <div class="screen">
    <div class="sidebar">
      <SideBar :org-logo="orgLogo"/>
    </div>
    <div class="main-area">
      <div class="control-container">
        <div class="control-section">
          <TheHeader :userdata="userdata"/>
        </div>
      </div>
      <div class="content-container">
        <div>
          <router-view />
        </div>
      </div>
      <div class="footer">
        <div class="footer-copy-right">
          Copyright @ Kearney 2023
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.screen {
  display: flex;
  width: 100vw;
  height: 100vh;
}
.sidebar {
  display: flex;
  flex-direction: column;
  min-width: 13rem;
  width: 10%;
}
.main-area {
  flex: 1 1 auto;
}
.control-container {
  display: flex;
  --tw-bg-opacity: 1;
  background-color: rgb(245 245 245 / var(--tw-bg-opacity));
  border-bottom-width: 1px;
  border-style: solid;
  --tw-border-opacity: 1;
  border-color: rgb(219 219 219 / var(--tw-border-opacity));
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}
.control-section {
  display: flex;
  width: 100%;
}
.content-container {
  display: flex;
  padding: 1rem;
  flex-direction: column;
  --tw-bg-opacity: 1;
  background-color: rgb(245 245 245 / var(--tw-bg-opacity));
}
.footer {
  position: relative;
  bottom: 0;
  display: flex;
  right: 1.5rem;
  width: 100%;
  height: 2rem;
  border-top-width: 1px;
  border-style: solid;
  border-bottom-width: 1px;
  --tw-border-opacity: 1;
  border-color: rgb(219 219 219 / var(--tw-border-opacity));
}
.footer-copy-right {
  margin-left: auto;
  display: flex;
  align-items: center;
}
</style>
