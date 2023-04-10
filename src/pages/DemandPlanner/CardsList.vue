<script>
import CardsListItem from './CardsListItem.vue';
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
    options: Object,
  },
  emits: ['setActiveCard'],
};
</script>

<template>
  <div
    v-for="(cardData, index) in data"
    :key="cardData.label"
    @click="$emit('setActiveCard', index)"
    :class="`tw-w-1/4 tw-cursor-pointer ${
      cardData.isActive
        ? 'tw-border-x tw-border-t tw-border-b-8 tw-border-solid tw-border-brand-primary tw--mb-5'
        : 'tw-border tw-border-solid tw-border-brand-secondary-10 tw-opacity-60'
    }`"
  >
    <CardsListItem :data="cardData" :options="options" />
  </div>
</template>
