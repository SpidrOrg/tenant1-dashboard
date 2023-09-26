<script>
import _ from 'lodash';
import { GChart } from 'vue-google-charts';
import fetchKeyDemandDriverDetails from '@/api/DemandPlannerMonthly/fetchKeyDemandDriverDetails';

const OTHERS_START_INDEX = 5;
const OTHER_DRIVERS = 'Others';

export default {
  name: 'ChartKeyDemandDrivers',
  components: {
    GChart,
  },
  props: {
    data: { type: Array, required: true },
    selectedFilters: { type: Object, required: true },
    horizon: { type: String, required: true },
  },
  data() {
    return {
      dialogIsShown: false,
      isFetchingDriverDetails: false,
      selectedDriver: null,
      selectedDriverDetails: null,
      chartEvents: {
        click: (e) => {
          const { targetID } = e;
          const [el, , index] = _.split(targetID, '#');
          if (el === 'bar' || el === 'annotationtext') {
            this.selectedDriver = _.head(this.chartData[_.toNumber(index) + 1]);
            this.fetchDriverDetails(this.selectedDriver);
            this.dialogIsShown = true;
          } else {
            this.dialogIsShown = false;
          }
        },
      },
      lodSize: _.size,
    };
  },
  methods: {
    closeDialog() {
      this.dialogIsShown = false;
    },
    async fetchDriverDetails(driver) {
      this.isFetchingDriverDetails = true;
      try {
        if (driver === OTHER_DRIVERS) {
          this.selectedDriverDetails = _.flatten(
            _.concat(
              await Promise.all(
                _.map(this.otherDrivers, (el) => {
                  const driver = _.keys(el)[0];
                  return fetchKeyDemandDriverDetails({
                    ...this.apiParams,
                    driver,
                  });
                })
              )
            )
          );
        } else {
          this.selectedDriverDetails = await fetchKeyDemandDriverDetails({
            ...this.apiParams,
            driver,
          });
        }
      } catch (e) {
        console.log(e);
      }
      this.isFetchingDriverDetails = false;
    },
    getPercentValue(value) {
      if (value === null || value === undefined || _.isNaN(_.toNumber(value)))
        return 'NA';
      return `${value}%`;
    },
    getSelectedDriverLabel() {
      if (this.selectedDriver === OTHER_DRIVERS) {
        const otherDriverNames = _.map(
          this.otherDrivers,
          (el) => _.keys(el)[0]
        );
        return _.join(otherDriverNames, ', ');
      }
      return this.selectedDriver;
    },
  },
  computed: {
    otherDrivers() {
      return _.slice(this.data, OTHERS_START_INDEX);
    },
    chartData() {
      const otherDriversValue = this.otherDrivers.reduce(
        (accumulator, currentEl) =>
          accumulator + _.toNumber(_.values(currentEl)[0]),
        0
      );

      const result = [
        ['X', 'Y', { role: 'annotation' }],
        ..._.map(_.slice(this.data, 0, OTHERS_START_INDEX), (v) => {
          return [
            _.keys(v)[0],
            _.values(v)[0],
            `${_.round(_.values(v)[0], 1)}%`,
          ];
        }),
      ];

      if (otherDriversValue > 0) {
        result.push([
          OTHER_DRIVERS,
          otherDriversValue,
          `${_.round(otherDriversValue, 1)}%`,
        ]);
      }

      return result;
    },
    dataValues() {
      return _.map(this.data, (v) => {
        return _.values(v)[0];
      });
    },
    chartOptions() {
      return {
        legend: 'none',
        tooltip: { trigger: 'none' },
        colors: ['#646F79'],
        annotations: {
          textStyle: {
            color: '#000000',
            fontSize: 12,
          },
          datum: { stem: { length: 2 } },
          alwaysOutside: true,
        },
        vAxis: {
          textStyle: {
            color: '#1E1E1E',
            fontName: 'Graphik',
            fontSize: 12,
          },
        },
        hAxis: {
          gridlines: {
            count: 0,
          },
          textPosition: 'none',
          viewWindow: {
            max: _.add(_.max(this.dataValues), 5),
            min: _.subtract(_.min(this.dataValues), 5),
          },
        },
        chartArea: {
          right: '8%',
          width: '50%',
          height: '90%',
        },
      };
    },
    apiParams() {
      const marketSensingRefreshDate = _.get(
        this.selectedFilters,
        'marketSensingRefreshDate'
      );
      const category = _.get(this.selectedFilters, 'category');

      return {
        marketSensingRefreshDate,
        category,
        horizon: this.horizon,
      };
    },
  },
};
</script>

<template>
  <div class="tw-flex tw-flex-col tw-justify-between tw-h-full">
    <v-menu open-on-hover location="top">
      <template v-slot:activator="{ props }">
        <span
          v-bind="props"
          class="tw-font-medium tw-text-lg small-laptop:tw-text-base desktop:tw-text-base tw-cursor-default"
        >
          Key Demand Drivers
        </span>
      </template>
      <div
        class="tw-w-96 tw-h-20 tw-p-2 tw-bg-white tw-border tw-rounded tw-border-[#D9D9D9] tw-shadow-2xl"
      >
        <p class="tw-text-sm tw-text-center">
          Most impactful types of data for the select projected period of demand
          predictions. These factors are accounting the most for the demand
          forecast.
        </p>
      </div>
    </v-menu>
    <GChart
      type="BarChart"
      :data="chartData"
      :options="chartOptions"
      :events="chartEvents"
      ref="chartKeyDemandDrivers"
    />
    <v-dialog
      :width="1040"
      :close-on-content-click="false"
      v-model="dialogIsShown"
    >
      <div
        class="tw-w-full tw-max-h-[80vh] tw-min-h-[590px] tw-bg-white tw-px-5 tw-py-4 tw-overflow-auto"
      >
        <div class="tw-flex tw-justify-between tw-gap-x-2">
          <div class="tw-flex tw-flex-col tw-items-start">
            <span class="tw-text-lg tw-text-brand-gray-3">
              Key Demand Driver(s)
            </span>
            <span class="tw-text-2xl tw-font-medium tw-text-black">{{
              getSelectedDriverLabel()
            }}</span>
          </div>
          <v-btn variant="plain" icon="mdi-close" @click="closeDialog"></v-btn>
        </div>
        <div
          class="tw-w-full tw-mt-32 tw-flex tw-justify-center tw-items-center"
          v-if="isFetchingDriverDetails"
        >
          <v-progress-circular
            indeterminate
            color="#7823DC"
            :size="80"
            :width="10"
          />
        </div>
        <div
          v-if="!isFetchingDriverDetails && lodSize(selectedDriverDetails) > 0"
          class="tw-py-4"
        >
          <div
            class="tw-flex tw-justify-between tw-gap-x-3 tw-items-center tw-p-3 tw-bg-brand-gray-1"
          >
            <span class="tw-text-lg tw-font-medium tw-text-black">
              Data point(s)
            </span>
            <div class="tw-flex tw-gap-x-1">
              <span
                class="tw-text-lg tw-font-medium tw-text-black tw-text-left tw-w-44"
              >
                Source(s)
              </span>
              <span
                class="tw-text-lg tw-font-medium tw-text-black tw-text-right tw-w-24 tw-pr-1"
              >
                Value
              </span>
            </div>
          </div>
          <ul class="tw-max-h-[420px] tw-overflow-scroll">
            <li
              v-for="(item, index) in selectedDriverDetails"
              :key="item.dataPoint"
              :class="`tw-flex tw-justify-between tw-gap-x-3 tw-items-center tw-p-3 ${
                index % 2 === 0 ? 'tw-bg-white' : 'tw-bg-brand-gray-1'
              }`"
            >
              <span class="tw-text-base tw-text-black">
                {{ item.dataPoint }}
              </span>
              <div class="tw-flex tw-gap-x-1">
                <span class="tw-text-base tw-text-black tw-text-left tw-w-44">
                  {{ item.source }}
                </span>
                <span
                  class="tw-text-base tw-text-black tw-text-right tw-w-24 tw-pr-1"
                  >{{ getPercentValue(item.value) }}</span
                >
              </div>
            </li>
          </ul>
        </div>
      </div>
    </v-dialog>
  </div>
</template>
