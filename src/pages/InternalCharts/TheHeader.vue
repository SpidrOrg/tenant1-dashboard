<script>
export default {
  name: "TheHeader",
  data(){
    return {
      isByVolume: false,
    }
  },
}
</script>

<template>
  <div class="tw-flex tw-gap-x-4 tw-w-full tw-bg-white tw-px-3">
    <div class="tw-pt-5 tw-w-1/6">
      <v-label>
        Customer
      </v-label>
      <v-select
        label="All Customers"
        :items="['All', 'Amazon', 'Walmart','Lowe`s']"
      ></v-select>
    </div>
    <div class="tw-pt-5 tw-w-1/6">
      <v-select
        label="All Categories"
        :items="['All', 'Laptops', 'Mobiles', 'PCs','Printers','Tablets']"
      ></v-select>
    </div>
    <div class="tw-pt-5 tw-w-1/6">
      <v-select
        label="MS Time Horizon"
        :items="['1-3 months', '4-6 months', '7-9 months','10-12 months']"
      ></v-select>
    </div>
    <div class="tw-pt-5 tw-w-1/6">
      <v-select
        label="Internal Model"
        :items="['1-3 months', '4-6 months']"
      ></v-select>
    </div>
    <div class="tw-flex tw-items-center tw-gap-1.5">
      <p :class="`${!isByVolume ? 'tw-font-medium' : ''}`">Value (USD)</p>
      <div class="tw-flex tw-pt-5" style="color: #7823DC;">
        <v-switch inset @click="isByVolume = !isByVolume"></v-switch>
      </div>
      <p :class="`${isByVolume ? 'tw-font-medium' : ''}`">Volume</p>
    </div>
  </div>
</template>
