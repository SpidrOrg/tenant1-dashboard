<script>
import _ from 'lodash';

const LANDING_ROUTE_NAME = 'landing';

export default {
  name: 'SideBar',
  props: {
    orgLogo: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      menuItems: [],
    };
  },
  computed: {
    cRoute() {
      if (!this.$route.name || this.$route.name === LANDING_ROUTE_NAME) {
        return _.get(this.$router, 'options.routes[0].children[1].name', '');
      }
      return this.$route.name;
    },
  },
  mounted() {
    const allRouteItems = _.map(
      _.get(this.$router, 'options.routes[0].children', []),
      (v) => _.omit(v, 'component')
    );
    this.menuItems = _.filter(
      allRouteItems,
      (v) => v.name !== LANDING_ROUTE_NAME
    );
  },
};
</script>

<template>
  <div class="logo-area">
    <div class="logo">
      <img class="logoImage" :src="orgLogo" />
    </div>
  </div>
  <div class="menu-area">
    <router-link
      v-for="menuItem in menuItems"
      :key="menuItem.name"
      :to="menuItem.path"
      :class="`menu-item ${
        menuItem.name === cRoute ? 'menu-item-selected' : ''
      }`"
    >
      <div class="menu-item-content">
        <div class="menu-item-content-image">
          <img :src="menuItem.icon_active" v-if="menuItem.name === cRoute" />
          <img :src="menuItem.icon" v-else />
        </div>
        <div>
          {{ menuItem.label }}
        </div>
      </div>
    </router-link>
  </div>
</template>

<style scoped>
.logo-area {
  width: 100%;
  height: 88px;
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
.logoImage {
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
