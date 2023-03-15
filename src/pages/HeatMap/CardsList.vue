<script>
import CardsListItem from '@/pages/HeatMap/CardsListItem.vue';
export default {
  name: 'CardsList',
  props: {
    data: {
      type: Array,
      required: true,
    },
  },
  components: {
    CardsListItem,
  },
};
</script>

<template>
  <div class="tw-grid tw-grid-cols-2 tw-gap-5 tw-w-full tw-h-full">
    <div v-for="cardData in data" :key="cardData.period">
      <CardsListItem :data="cardData" />
    </div>
  </div>
</template>
