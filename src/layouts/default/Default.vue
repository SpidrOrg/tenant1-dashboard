<template>
  <v-app class="gp-full-height" >
    <default-view :userdata="userdata"/>
  </v-app>
</template>

<script>
  import DefaultView from './View.vue'

  export default {
    name: "default-p",
    props: {
      userdata: {
        type: Object,
        require: true
      }
    },
    components: {
      DefaultView
    }
  }
</script>

<style>
.gp-full-height > div{
  min-height:  95vh !important;
}
</style>

