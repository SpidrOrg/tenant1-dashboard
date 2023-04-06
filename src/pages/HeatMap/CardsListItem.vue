<script>
import _ from 'lodash';
import TooltipChart from '@/pages/HeatMap/TooltipChart.vue';

export default {
  name: 'CardsListItem',
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  components: {
    TooltipChart,
  },
  data() {
    return {
      lodGet: _.get,
      lodSize: _.size,
      menu: {},
    };
  },
  methods: {
    getCellStyling(cellValue) {
      let styles = 'tw-cursor-pointer tw-text-center tw-rounded tw-shadow';

      if (Math.abs(cellValue) >= 20) styles += ' tw-bg-brand-red-2';
      else if (Math.abs(cellValue) >= 6) styles += ' tw-bg-brand-yellow-2';
      else styles += ' tw-bg-brand-green-2';

      return styles;
    },
    closeMenu(data) {
      this.menu[data] = false;
    },
  },
};
</script>

<template>
  <div
    class="tw-flex tw-flex-col tw-gap-3 tw-w-full tw-h-full tw-bg-white tw-p-4"
  >
    <p class="tw-text-xl tw-font-medium">{{ data.period }}</p>
    <div class="tw-w-full tw-border tw-border-solid tw-border-brand-gray-2" />
    <div class="tw-w-full tw-h-full tw-overflow-auto">
      <div
        :class="`tw-grid tw-grid-cols-${lodSize(
          lodGet(data, 'columnHeaders', [])
        )} tw-grid-flow-col tw-gap-x-3 tw-pb-4`"
      >
        <span
          v-for="(columnHeader, index) in data.columnHeaders"
          :key="columnHeader"
          :class="`tw-font-medium tw-text-sm ${
            index > 0 ? 'tw-text-center' : ''
          }`"
        >
          {{ columnHeader }}
        </span>
      </div>
      <div
        :class="`tw-grid tw-grid-rows-${lodSize(
          lodGet(data, 'records', [])
        )} tw-grid-flow-row tw-gap-y-3`"
      >
        <div
          v-for="rowData in data.records"
          :key="rowData[0]"
          :class="`tw-grid tw-grid-cols-${lodSize(
            rowData ?? []
          )} tw-grid-flow-col tw-gap-x-3 tw-items-center`"
        >
          <div
            v-for="(cellValue, index) in rowData"
            :key="`${rowData[0]}-${cellValue}`"
          >
            <v-menu
              location="right"
              :close-on-content-click="false"
              :persistent="true"
              v-model="menu[`${rowData[0]}${index}`]"
            >
              <template v-slot:activator="{ props }">
                <div
                  v-bind="index > 0 && props"
                  @click="menu[`${rowData[0]}${index}`] = true"
                  :class="`tw-py-3 tw-font-medium ${
                    index > 0 ? getCellStyling(cellValue) : 'tw-text-sm'
                  }`"
                >
                  {{ `${cellValue}${index > 0 ? '%' : ''}` }}
                </div>
              </template>
              <TooltipChart
                :category="data.columnHeaders[index]"
                :customer="rowData[0]"
                :period="data.period"
                @closeEvent="closeMenu(`${rowData[0]}${index}`)"
              />
            </v-menu>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
