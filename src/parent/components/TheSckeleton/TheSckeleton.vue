<script>
import SideBar from './SideBar.vue';
import TheHeader from './TheHeader.vue';

const DESKTOP_SCREEN_MIN_WIDTH_PIXELS = 1440;

export default {
  name: 'TheSckeleton',
  components: {
    SideBar,
    TheHeader,
  },
  props: {
    orgLogo: {
      type: String,
      required: true,
    },
    userdata: {
      type: Object,
      required: false,
    },
  },
  data() {
    return {
      isSidebarCollapsed: false,
      orgLogoSmall: '/src/images/orgLogoSmall.svg',
    };
  },
  methods: {
    expandSidebarHandler() {
      if (window.screen.availWidth < DESKTOP_SCREEN_MIN_WIDTH_PIXELS) {
        const sidebar = document.querySelector('.sidebar');
        sidebar.style.minWidth = '13rem';
        sidebar.style.maxWidth = '10%';
        this.isSidebarCollapsed = false;
      }
    },
    collapseSidebarHandler() {
      if (window.screen.availWidth < DESKTOP_SCREEN_MIN_WIDTH_PIXELS) {
        const sidebar = document.querySelector('.sidebar');
        sidebar.style.minWidth = '0px';
        sidebar.style.maxWidth = '48px';
        this.isSidebarCollapsed = true;
      }
    },
  },
  mounted() {
    if (window.screen.availWidth < DESKTOP_SCREEN_MIN_WIDTH_PIXELS) {
      this.isSidebarCollapsed = true;
    } else {
      this.isSidebarCollapsed = false;
    }
  },
};
</script>

<template>
  <div class="screen">
    <div
      class="sidebar"
      @mouseover="expandSidebarHandler"
      @mouseout="collapseSidebarHandler"
    >
      <SideBar
        :org-logo="isSidebarCollapsed ? orgLogoSmall : orgLogo"
        :isSidebarCollapsed="isSidebarCollapsed"
      />
    </div>
    <div class="main-area">
      <div class="control-container">
        <div class="control-section">
          <TheHeader :userdata="userdata" />
        </div>
      </div>
      <div class="content-container">
        <router-view :userdata="userdata" />
      </div>
      <footer class="footer">
        <div class="footer-copy-right">Copyright @ Kearney 2023</div>
      </footer>
    </div>
  </div>
</template>

<style scoped>
@media screen and (max-width: 1439px) {
  .sidebar {
    display: flex;
    flex-direction: column;
    max-width: 48px;
    padding-top: 60px;
    white-space: nowrap;
    overflow-x: hidden;
    transition: 0.5s;
    z-index: 9999;
    position: fixed;
    height: 100%;
    background: white;
    box-shadow: rgba(0, 0, 0, 0.4) 0px 8px 16px;
    top: 0px;
  }
  .main-area {
    flex: 1 1 auto;
    margin-left: 48px;
  }
}

@media screen and (min-width: 1440px) {
  .sidebar {
    display: flex;
    flex-direction: column;
    min-width: 13rem;
    width: 10%;
  }
}

.screen {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: scroll;
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
  display: flex;
  width: 100%;
  height: 3rem;
  padding-left: 1rem;
  padding-right: 1rem;
  border-top-width: 1px;
  border-style: solid;
  --tw-border-opacity: 1;
  border-color: rgb(219 219 219 / var(--tw-border-opacity));
  --tw-bg-opacity: 1;
  background-color: rgb(245 245 245 / var(--tw-bg-opacity));
}
.footer-copy-right {
  margin-left: auto;
  display: flex;
  align-items: center;
}
</style>
