<template>
  <v-app class="gp-full-height" >
    <default-view />
  </v-app>
</template>

<script setup>
  import DefaultView from './View.vue'
</script>

<style>
.gp-full-height > div{
  min-height:  95vh !important;
}
</style>

