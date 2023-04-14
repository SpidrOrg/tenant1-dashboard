<script>
import { LAG_VALUES } from './HeatMap.vue';

import CardsListItem from '@/pages/HeatMap/CardsListItem.vue';

export default {
  name: 'CardsList',
  components: {
    CardsListItem,
  },
  props: {
    data: {
      type: Array,
      required: true,
    },
    selectedFilters: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      LAG_VALUES,
    };
  },
};
</script>

<template>
  <div class="tw-grid tw-grid-cols-2 tw-gap-5 tw-w-full tw-h-full">
    <div v-for="(cardData, index) in data" :key="cardData.period">
      <CardsListItem
        :data="cardData"
        :selectedFilters="selectedFilters"
        :lag="LAG_VALUES[index]"
      />
    </div>
  </div>
</template>
