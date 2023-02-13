<script>
import MainNav from "@/MainNav.vue";
export default {
  name: "App",
  components: {
    MainNav,
  },
};
</script>

<template>
  <div>
    <MainNav />
  </div>
  <router-view />
</template>
