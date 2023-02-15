<script>
import _ from 'lodash';

const LANDING_ROUTE_NAME = "landing";

export default {
  name: "SideBar",
  props: {
    orgLogo: {
      type: String,
      required: true
    }
  },
  data(){
    return {
      menuItems: []
    }
  },
  computed: {
    cRoute(){
      if (!this.$route.name || this.$route.name === LANDING_ROUTE_NAME){
        return _.get(this.$router, "options.routes[0].children[1].name", "");
      }
      return this.$route.name
    }
  },
  mounted() {
    const allRouteItems = _.map(_.get(this.$router, "options.routes[0].children", []), v => _.omit(v, "component"));
    this.menuItems = _.filter(allRouteItems, v => v.name !== LANDING_ROUTE_NAME)
  },
}
</script>

<template>
  <div class="logo-area">
    <div class="logo">
      <img class="logoImage" :src="orgLogo"/>
    </div>
  </div>
  <div class="menu-area">
    <router-link v-for="menuItem in menuItems" :key="menuItem.name" :to="menuItem.path" :class="`menu-item ${menuItem.name === cRoute ? 'menu-item-selected': ''}`">
      <div class="menu-item-content">
        <div class="menu-item-content-image">
          <img :src="menuItem.icon"/>
        </div>
        <div>
          {{menuItem.label}}
        </div>
      </div>

    </router-link>
  </div>
</template>

<style scoped>
.logo-area {
  width: 100%;
  height: 4rem;
  display: flex;
  align-self: center;
  justify-self: center;
}
.logo {
  display: flex;
  object-fit: contain;
  margin: auto;
}
.logoImage {
  width: 125px;
}
.menu-area {
  display: flex;
  flex-direction: column;
}

.menu-item {
  display: flex;
  width: 100%;
  height: 48px;
  background: #FFFFFF;
  padding: 24px 16px;
  align-items: center;
  flex-wrap: nowrap;
  color: #1E1E1E;
  cursor: pointer;
}
.menu-item-content {
  display: flex;
  gap:8px;
}

.menu-item-content-image {
  width: 25px;
  height: 19px
}

.menu-item-selected {
  background: #8737E1;
  color: #FFFFFF;
}
</style>
