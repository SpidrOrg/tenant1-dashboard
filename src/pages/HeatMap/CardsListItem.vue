<script>
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
  methods: {
    getCellStyling(cellValue) {
      let styles = 'tw-cursor-pointer tw-text-center tw-rounded';

      if (Math.abs(cellValue) >= 20) styles += ' tw-bg-brand-red-1';
      else if (Math.abs(cellValue) >= 6) styles += ' tw-bg-brand-yellow-1';
      else styles += ' tw-bg-brand-green-2';

      return styles;
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
        :class="`tw-grid tw-grid-cols-${data.columnHeaders.length} tw-gap-x-3 tw-pb-4`"
      >
        <span
          v-for="columnHeader in data.columnHeaders"
          :key="columnHeader"
          class="tw-font-medium tw-text-sm"
        >
          {{ columnHeader }}
        </span>
      </div>
      <div :class="`tw-grid tw-grid-rows-${data.records.length} tw-gap-y-3`">
        <div
          v-for="rowData in data.records"
          :key="rowData[0]"
          :class="`tw-grid tw-grid-cols-${rowData.length} tw-gap-x-3 tw-items-center`"
        >
          <div
            v-for="(cellValue, index) in rowData"
            :key="`${rowData[0]}-${cellValue}`"
          >
            <v-menu location="right">
              <template v-slot:activator="{ props }">
                <div
                  v-bind="index > 0 && props"
                  :class="`tw-py-3 tw-font-medium ${
                    index > 0 ? getCellStyling(cellValue) : 'tw-text-sm'
                  }`"
                >
                  {{ `${cellValue}${index > 0 ? '%' : ''}` }}
                </div>
              </template>
              <TooltipChart />
            </v-menu>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
