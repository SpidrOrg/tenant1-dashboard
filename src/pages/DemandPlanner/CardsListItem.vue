<script>
import { GChart }  from 'vue-google-charts'

export default {
  name: 'CardsListItem',
  components: {
    GChart
  },
  props: {
    data: {
      type: Object,
      required: true
    },
  },
  methods: {
    colorBtnFunc(n) {
      if(Math.abs(n) >= 20) {
        return '#DC3545';
      }
      if(Math.abs(n) >= 6) {
        return '#FF9900';
      }
      return '#04BB46';
    },
  }
}
</script>

<template>
  <div class="tw-w-full tw-h-full tw-px-3 tw-py-1">
    <div class="tw-flex tw-flex-col tw-py-2">
      <p style="color: #9291A5;">Projected Period</p>
      <div class="tw-flex tw-gap-x-4 tw-items-center tw-w-full">
        <p class="tw-text-xl tw-font-medium">{{ data.period }}</p>
        <div class="tw-bg-brand-gray-4 tw-rounded">
          <p class="tw-p-1 tw-text-sm">Future {{ data.lag }} months</p>
        </div>
      </div>
    </div>
    <div class="tw-w-full tw-border-t tw-border-solid tw-border-brand-gray-2"/>
    <div class="tw-grid tw-grid-cols-5 tw-py-2">
      <div class="tw-col-span-3">
        <p class="tw-font-medium tw-text-base">Projected Growth (%YoY)</p>
        <div class="tw-grid tw-grid-cols-2 tw-pt-4">
          <div>
            <p class="tw-text-2xl tw-font-semibold">{{ `${data.internal}%` }}</p>
            <span class="tw-text-sm">Planned Internal Forecast</span>
          </div>
          <div>
            <p class="tw-text-2xl tw-font-semibold">{{ `${data.marketSensing}%` }}</p>
            <span class="tw-text-sm">Market Sensing Model Forecast</span>
          </div>
        </div>
      </div>
      <div class="tw-flex tw-flex-col tw-items-center tw-col-span-2">
        <p class="tw-font-medium tw-text-center tw-pb-6">ML Model Accuracy</p>
        <div class="tw-relative tw-flex tw-items-center tw-w-20 tw-h-12">
          <div class="tw-absolute tw-z-10 tw-h-full tw-w-full tw-flex tw-items-center tw-justify-center tw-text-xl tw-font-semibold">
            {{Math.round(data.modelAccuracy.current, 0)}}%
          </div>
          <GChart type="PieChart"
                  :data="[
                                ['Effort', 'Percentage'],
                                ['single', data.modelAccuracy.current],
                                ['', 100-data.modelAccuracy.current]
                              ]"
                  :options="{
                          pieHole: 0.7,
                          pieSliceTextStyle: {
                            color: 'black',
                            fontSize: '20px'
                          },
                          theme: 'maximized',
                          legend: 'none',
                          slices: {
                            0: {color: '#9150E1', textStyle: {color: 'transparent'}},
                            1: {color: '#E6E6E6', textStyle: {color: 'transparent'}}
                          },
                          height: 81,
                          width: 81
                          }"/>
        </div>
      </div>
    </div>
    <div class="tw-w-full tw-flex tw-justify-center tw-items-center tw-gap-3 tw-pt-2">
      <div class="tw-flex tw-flex-col">
          <span class="tw-text-4xl tw-font-semibold" :style="{'color': colorBtnFunc(data.variance)}">
            {{ `${data.variance}%` }}
          </span>
        <span class="tw-text-sm">Variance</span>
      </div>
      <div>
        <v-btn v-if="data.variance <= -20 || data.variance >= 20" prepend-icon="mdi-alert-circle" variant="outlined" :color="colorBtnFunc(data.variance)" rounded="pill">
          Review<v-icon end icon="mdi-chevron-right"></v-icon>
        </v-btn>
        <v-btn v-else-if="data.variance >= -5 || data.variance <= 5" prepend-icon="mdi-circle" variant="outlined" :color="colorBtnFunc(data.variance)" rounded="pill">
          No Action
          <v-icon end icon="mdi-chevron-right"></v-icon>
        </v-btn>
        <v-btn v-else-if="-20 <= data.variance >= -6 || 6 <= data.variance <= 20" prepend-icon="mdi-circle" variant="outlined" :color="colorBtnFunc(data.variance)" rounded="pill">
          Watch List
          <v-icon end icon="mdi-chevron-right"></v-icon>
        </v-btn>
      </div>
    </div>
  </div>
</template>
