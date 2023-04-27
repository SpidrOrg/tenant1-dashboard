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
    selectedFilters: {
      type: Object,
      required: true,
    },
    lag: {
      type: Number,
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
  computed: {
    marketSensingRefreshDate() {
      return _.get(this.selectedFilters, 'marketSensingRefreshDate');
    },
    valueORvolume() {
      return _.get(this.selectedFilters, 'valueORvolume');
    },
    formattedHorizon() {
      return `${this.lag}-${this.lag + 2}`;
    },
  },
  methods: {
    getCellStyling(cellValue, isRowLabel = false) {
      let styles = 'tw-py-3 tw-font-medium';

      if (isRowLabel) {
        styles +=
          ' tw-text-sm tw-text-left tw-whitespace-nowrap tw-text-ellipsis tw-overflow-hidden tw-cursor-default';
        return styles;
      } else {
        styles += ' tw-text-center tw-rounded tw-shadow tw-cursor-pointer';
      }

      if (cellValue === null || _.isNaN(_.toNumber(cellValue))) {
        styles += ' tw-bg-brand-gray-2';
        return styles;
      }

      const val = _.round(_.toNumber(cellValue), 0);

      if (Math.abs(val) >= 20) styles += ' tw-bg-brand-red-2';
      else if (Math.abs(val) >= 6) styles += ' tw-bg-brand-yellow-2';
      else styles += ' tw-bg-brand-green-2';

      return styles;
    },
    getCellLabel(cellValue, isPercentValue = true) {
      if (cellValue === null || _.isNaN(_.toNumber(cellValue))) return 'NA';
      const val = _.round(_.toNumber(cellValue), 0);
      return `${val}${isPercentValue ? '%' : ''}`;
    },
    closeMenu(key) {
      this.menu[key] = false;
    },
    handleCellClick(key, isClickDisabled = false) {
      if (isClickDisabled) return;
      this.menu[key] = true;
    },
  },
};
</script>

<template>
  <div
    class="tw-flex tw-flex-col tw-gap-3 tw-w-full tw-h-full tw-bg-white tw-p-4"
  >
    <div class="tw-flex tw-gap-x-4 tw-items-center tw-w-full">
      <p class="tw-text-xl tw-font-medium">{{ data.period }}</p>
      <div class="tw-bg-brand-gray-4 tw-rounded tw-text-center">
        <p class="tw-p-1 tw-text-sm">Future {{ formattedHorizon }} months</p>
      </div>
    </div>
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
          :class="`tw-font-medium tw-text-sm tw-cursor-default ${
            index > 0 ? 'tw-text-center' : 'tw-text-left'
          }`"
        >
          <span v-if="index === 0">{{ columnHeader }}</span>
          <v-menu open-on-hover location="top" v-if="index > 0">
            <template v-slot:activator="{ props }">
              <span v-bind="props">{{ columnHeader }}</span>
            </template>
            <div
              class="tw-w-auto tw-h-auto tw-flex tw-items-center tw-p-1 tw-text-sm tw-bg-white tw-border tw-rounded tw-border-[#D9D9D9] tw-shadow-xl"
            >
              {{ columnHeader }}
            </div>
          </v-menu>
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
              v-model="menu[`${rowData[0]}${index}`]"
            >
              <template v-slot:activator="{ props }">
                <div
                  v-bind="index > 0 && props"
                  @click="handleCellClick(`${rowData[0]}${index}`, index === 0)"
                  :class="getCellStyling(cellValue, index === 0)"
                >
                  <span v-if="index > 0">{{ getCellLabel(cellValue) }}</span>
                  <v-menu open-on-hover location="top" v-if="index === 0">
                    <template v-slot:activator="{ props }">
                      <span v-bind="props">{{ cellValue }}</span>
                    </template>
                    <div
                      class="tw-w-auto tw-h-auto tw-flex tw-items-center tw-p-1 tw-text-sm tw-bg-white tw-border tw-rounded tw-border-[#D9D9D9] tw-shadow-xl"
                    >
                      {{ cellValue }}
                    </div>
                  </v-menu>
                </div>
              </template>
              <TooltipChart
                :marketSensingRefreshDate="marketSensingRefreshDate"
                :valueORvolume="valueORvolume"
                :category="data.columnHeaders[index]"
                :customer="rowData[0]"
                :lag="lag"
                @closeEvent="closeMenu(`${rowData[0]}${index}`)"
              />
            </v-menu>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
