<script>
import TooltipChart from "@/pages/HeatMap/TooltipChart.vue";

export default {
  name: "TheCard",
  props: {
    title: {
      type: String,
      required: true
    },
    data: {
      type: Array,
      required: true
    }
  },
  components: {
    TooltipChart
  },
  methods: {
    getCellStyling (cellValue) {
      let styles = 'tw-text-center tw-rounded'

      if(cellValue < -20 || cellValue > 20)  styles+= ' tw-bg-brand-red-1'
      else if( cellValue < -6 || cellValue > 6 ) styles+=  ' tw-bg-brand-yellow-1'
      else styles+= ' tw-bg-brand-green-2'

      return styles
    }
  }
}
</script>

<template>
  <div class="tw-flex tw-flex-col tw-gap-3 tw-w-full tw-h-full tw-bg-white tw-p-4">
    <p class="tw-text-xl tw-font-medium">{{title}}</p>
    <div class="tw-w-full tw-border tw-border-solid tw-border-brand-gray-2"/>
    <div class="tw-grid tw-grid-cols-6 tw-gap-x-3 tw-w-full tw-h-full">
      <div v-for="column in data" :key="column.label" class="tw-flex tw-flex-col tw-justify-evenly">
        <p class="tw-font-medium">{{column.label}}</p>
        <div v-for="value in column.values" :key="value" :class="`tw-cursor-pointer ${column.label !== 'Name' ? getCellStyling(value) : ''}`">
          <v-menu>
            <template v-slot:activator="{ props }">
              <p v-bind="props" class="tw-font-medium tw-py-3">{{`${value}${column.label !== 'Name' ? '%': ''}`}}</p>
            </template>
            <div class="tw-border-2 tw-shadow-2xl tw-p-0">
              <TooltipChart />
            </div>
          </v-menu>
        </div>
      </div>
    </div>
  </div>
</template>
