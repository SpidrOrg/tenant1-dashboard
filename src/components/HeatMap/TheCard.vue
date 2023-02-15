<script>
import HEAT_MAP_DATA from './constants'
import {tr} from "vuetify/locale";
export default {
  name: "TheCard",
  props: {
    title: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      HEAT_MAP_DATA
    }
  },
  methods: {
    getCellStyling (cellValue) {
      let styles = 'tw-text-center tw-rounded'
      if(cellValue < -20 || cellValue > 20)  styles+= ' tw-bg-brand-red'
      else if( cellValue < -6 || cellValue > 6 ) styles+=  ' tw-bg-brand-yellow'
      else styles+= ' tw-bg-brand-green'

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
      <div v-for="column in HEAT_MAP_DATA" :key="column.label" class="tw-flex tw-flex-col tw-justify-evenly">
        <p class="tw-font-medium">{{column.label}}</p>
        <div v-for="value in column.values" :key="value" :class="column.label !== 'Name' ? getCellStyling(value) : ''">
          <p class="tw-font-medium tw-py-3">{{`${value}${column.label !== 'Name' ? '%': ''}`}}</p>
        </div>
      </div>
    </div>
  </div>
</template>
