<script>
export default {
  name: 'SideBar',
  props: {
    orgLogo: {
      type: String,
      required: true,
    },
    activePageKey: { type: String, required: true },
    PAGES_CONFIG: { type: Object, required: true },
    PAGE_KEYS: { type: Object, required: true },
    isSidebarCollapsed: { type: Boolean, default: false },
  },
  emits: ['pageSelected'],
  data() {
    return {
      menuItems: [],
    };
  },
  methods: {
    menuItemClickHandler(pageKey) {
      this.$emit('pageSelected', pageKey);
    },
  },
};
</script>

<template>
  <div class="logo-area">
    <div class="logo">
      <img
        :class="isSidebarCollapsed ? 'logoImageSmall' : 'logoImageLarge'"
        :src="orgLogo"
      />
    </div>
  </div>
  <div class="menu-area">
    <div
      v-for="pageKey in PAGE_KEYS"
      :key="pageKey"
      :class="`menu-item ${
        pageKey === activePageKey ? 'menu-item-selected' : ''
      }`"
      @click="menuItemClickHandler(pageKey)"
    >
      <div class="menu-item-content">
        <div class="menu-item-content-image">
          <img
            :src="PAGES_CONFIG[pageKey].icon_active"
            v-if="PAGES_CONFIG[pageKey] && pageKey === activePageKey"
          />
          <img v-if="PAGES_CONFIG[pageKey]" :src="PAGES_CONFIG[pageKey].icon" />
        </div>
        <div v-if="PAGES_CONFIG[pageKey]">
          {{ PAGES_CONFIG[pageKey].label }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.logo-area {
  width: 100%;
  height: 80px;
  margin-bottom: 20px;
  display: flex;
  align-self: center;
  justify-self: center;
}
.logo {
  display: flex;
  object-fit: contain;
  margin-top: 16px;
  margin-right: auto;
  margin-bottom: auto;
  margin-left: auto;
}
.logoImageSmall {
  width: 28px;
}
.logoImageLarge {
  width: 128px;
}
.menu-area {
  display: flex;
  flex-direction: column;
}

.menu-item {
  display: flex;
  width: 100%;
  height: 48px;
  background: #ffffff;
  padding: 24px 16px;
  align-items: center;
  flex-wrap: nowrap;
  color: #1e1e1e;
  cursor: pointer;
}
.menu-item-content {
  display: flex;
  gap: 8px;
}

.menu-item-content-image {
  width: 25px;
  height: 19px;
}

.menu-item-selected {
  background: #8737e1;
  color: #ffffff;
}
</style>
