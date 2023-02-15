<script>
import HEAT_MAP_DATA from './constants'
import TooltipChart from "@/components/HeatMap/TooltipChart.vue";
import {tr} from "vuetify/locale";
export default {
  name: "TheCard",
  props: {
    title: {
      type: String,
      required: true
    }
  },
  components: {
    TooltipChart
  },
  data() {
    return {
      HEAT_MAP_DATA,
      dialog: false
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

<!--        <v-dialog-->
<!--          v-model="dialog"-->
<!--          width="auto"-->
<!--        >-->
<!--          <template v-slot:activator="{ props }">-->
<!--            <v-btn-->
<!--              color="primary"-->
<!--              v-bind="props"-->
<!--            >-->
<!--              Open Dialog-->
<!--            </v-btn>-->
<!--          </template>-->

<!--          <v-card>-->
<!--            <v-card-text>-->
<!--              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.-->
<!--            </v-card-text>-->
<!--            <v-card-actions>-->
<!--              <v-btn color="primary" block @click="dialog = false">Close Dialog</v-btn>-->
<!--            </v-card-actions>-->
<!--          </v-card>-->
<!--        </v-dialog>-->

        <div v-for="value in column.values" :key="value" :class="`tw-cursor-pointer ${column.label !== 'Name' ? getCellStyling(value) : ''}`">
          <v-menu>
            <template v-slot:activator="{ props }">
              <p v-bind="props" class="tw-font-medium tw-py-3">{{`${value}${column.label !== 'Name' ? '%': ''}`}}</p>
            </template>
            <TooltipChart />
          </v-menu>
        </div>
      </div>
    </div>
  </div>
</template>
