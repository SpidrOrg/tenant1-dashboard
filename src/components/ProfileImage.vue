<script>
export default {
  name: "ProfileImage",
  data() {
    return {
      imageLink: "/anyUser.png",
    };
  },
};
</script>
<template>
  <img :src="imageLink" class="h-8 w-8 rounded-3xl object-contain" alt="User" />
</template>
