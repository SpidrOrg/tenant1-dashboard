<template>
  <v-main>
    <router-view :userdata="userdata"/>
  </v-main>
</template>

<script>
  export default {
    name: "default-view",
    props: {
      userdata: {
        type: Object,
        required: true
      }
    }
  }
</script>
