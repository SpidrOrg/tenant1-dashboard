<script>
import ActionButton from "@/components/ActionButton.vue";
import ProfileImage from "@/components/ProfileImage.vue";
import TheSubNav from "@/components/TheSubNav.vue";

export default {
  name: "MainNav",
  components: {
    ActionButton,
    ProfileImage,
    TheSubNav,
  },
  data() {
    return {
      menuItems: [
        {
          label: "Teams",
          routeName: "Teams",
        },
        {
          label: "Location",
          routeName: "Location",
        },
        {
          label: "Life at Bobo Careers",
          routeName: "LifeAtBoboCareers",
        },
        {
          label: "How we hire",
          routeName: "HowWeHire",
        },
        {
          label: "Students",
          routeName: "Students",
        },
        {
          label: "Jobs",
          routeName: "JobResults",
        },
      ],
      isLoggedIn: false,
    };
  },
  computed: {
    headerHeightClass() {
      return this.isLoggedIn && this.$route.name === "JobResults" ? "h-32" : "h-16";
    },
  },
  methods: {
    loginUser() {
      this.isLoggedIn = true;
    },
  },
};
</script>

<template>
  <header :id="headerHeightClass" :class="`w-full text-sm ${headerHeightClass}`">
    <div class="fixed top-0 left-0 h-16 w-full bg-white">
      <div class="mx-auto flex h-full flex-nowrap border-b border-solid border-brand-gray-1 px-8">
        <router-link :to="{ name: 'Home' }" class="flex h-full items-center text-xl">Bobo Careers</router-link>
        <nav class="ml-12 h-full">
          <ul class="flex h-full list-none">
            {{
              isLoggedIn
            }}
            <li v-for="menuItem in menuItems" :key="menuItem.label" class="ml-9 h-full first:ml-0">
              <router-link :to="{ name: menuItem.routeName }" class="flex h-full items-center py-2.5">{{
                menuItem.label
              }}</router-link>
            </li>
          </ul>
        </nav>
        <div class="ml-auto flex h-full items-center">
          <ActionButton label="Sign In" v-if="isLoggedIn === false" @click="loginUser" type="secondary" />
          <ProfileImage v-else />
        </div>
      </div>
      <TheSubNav v-if="isLoggedIn === true && $route.name === 'JobResults'" />
    </div>
  </header>
</template>
