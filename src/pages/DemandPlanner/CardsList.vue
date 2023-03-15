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
    class="tw-w-1/4 tw-cursor-pointer"
    :style="
      cardData.isActive
        ? 'border-width: 1px 1px 6px 1px; border-style: solid; border-color: #7823DC; margin-bottom: -22px'
        : 'border:1px solid #E5E5EF; opacity:60%'
    "
  >
    <CardsListItem :data="cardData" :options="options" />
  </div>
</template>
