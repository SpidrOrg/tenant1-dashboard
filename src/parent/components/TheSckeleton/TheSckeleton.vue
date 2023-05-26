<script>
import _ from 'lodash';
import SideBar from './SideBar.vue';
import TheHeader from './TheHeader.vue';

const DESKTOP_SCREEN_MIN_WIDTH_PIXELS = 1440;
const FAQS_URL =
  'https://xebiagroup.sharepoint.com/sites/ProjectKearney/Gedeelde%20documenten/Forms/AllItems.aspx?id=%2Fsites%2FProjectKearney%2FGedeelde%20documenten%2FGeneral%2FContent%2FKearney%5FMS%20Demand%20Dashboard%20FAQ%2Epdf&parent=%2Fsites%2FProjectKearney%2FGedeelde%20documenten%2FGeneral%2FContent&p=true&ct=1684174121283&or=OWA%2DNT&cid=1b364130%2Dcec9%2D447e%2D6e14%2D746cabb41467&ga=1';

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
    PAGES_CONFIG: { type: Object, required: true },
    PAGE_KEYS: { type: Object, required: true },
  },
  data() {
    return {
      activePageKey: this.PAGE_KEYS.DEMAND_PLANNER,

      isSidebarCollapsed: false,
      orgLogoSmall: '/src/images/orgLogoSmall.svg',
    };
  },
  computed: {
    ActiveComponent() {
      return this.PAGES_CONFIG[this.activePageKey].component;
    },
  },
  methods: {
    pageSelectionHandler(key) {
      if (key === this.PAGE_KEYS.FAQS) {
        window.open(FAQS_URL, '_blank');
        return;
      }

      this.activePageKey = key;
      sessionStorage.setItem('pageKey', key);
    },
    expandSidebarHandler() {
      if (window.screen.availWidth < DESKTOP_SCREEN_MIN_WIDTH_PIXELS) {
        const sidebar = document.querySelector('.sidebar');
        sidebar.style.minWidth = '13rem';
        sidebar.style.maxWidth = '10%';
        sidebar.style['z-index'] = 9999;
        this.isSidebarCollapsed = false;
      }
    },
    collapseSidebarHandler() {
      if (window.screen.availWidth < DESKTOP_SCREEN_MIN_WIDTH_PIXELS) {
        const sidebar = document.querySelector('.sidebar');
        sidebar.style.minWidth = '0px';
        sidebar.style.maxWidth = '48px';
        sidebar.style['z-index'] = 0;
        this.isSidebarCollapsed = true;
      }
    },
  },
  created() {
    const currentPageKey = sessionStorage.getItem('pageKey');
    if (_.includes(this.PAGE_KEYS, currentPageKey)) {
      this.activePageKey = currentPageKey;
    } else {
      this.activePageKey = this.PAGE_KEYS.DEMAND_PLANNER;
      sessionStorage.setItem('pageKey', this.activePageKey);
    }
  },
  mounted() {
    if (window.screen.availWidth < DESKTOP_SCREEN_MIN_WIDTH_PIXELS) {
      this.isSidebarCollapsed = true;
    } else {
      this.isSidebarCollapsed = false;
    }

    const resizeObserver = new ResizeObserver(() => {
      if (window.screen.availWidth < DESKTOP_SCREEN_MIN_WIDTH_PIXELS) {
        this.collapseSidebarHandler();
      } else {
        const sidebar = document.querySelector('.sidebar');
        sidebar.style.minWidth = '13rem';
        sidebar.style.maxWidth = '10%';
        this.isSidebarCollapsed = false;
      }
    });

    resizeObserver.observe(document.querySelector('.screen'));
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
        :PAGES_CONFIG="PAGES_CONFIG"
        :PAGE_KEYS="PAGE_KEYS"
        :activePageKey="activePageKey"
        @page-selected="pageSelectionHandler"
      />
    </div>
    <div class="main-area">
      <div class="control-container">
        <div class="control-section">
          <TheHeader :userdata="userdata" />
        </div>
      </div>
      <div class="content-container">
        <component :is="ActiveComponent" v-bind="{ userdata }"></component>
      </div>
      <div class="tw-px-5 tw-bg-brand-gray-1">
        <footer
          class="tw-w-full tw-flex tw-p-4 tw-border-t tw-border-solid tw-border-brand-gray-2"
        >
          <div class="tw-ml-auto tw-flex tw-items-center">
            Copyright @ Kearney 2023
          </div>
        </footer>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media screen and (max-width: 1439px) {
  .sidebar {
    display: flex;
    flex-direction: column;
    max-width: 48px;
    white-space: nowrap;
    overflow-x: hidden;
    transition: 0.5s;
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
    max-width: 10%;
    white-space: nowrap;
    overflow-x: hidden;
  }
}

.screen {
  display: flex;
  width: 100vw;
  height: 100vh;
}

.main-area {
  flex: auto;
  overflow: auto;
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
  min-height: 100%;
  max-height: fit-content;
  display: flex;
  padding: 1rem;
  flex-direction: column;
  --tw-bg-opacity: 1;
  background-color: rgb(245 245 245 / var(--tw-bg-opacity));
}
</style>
