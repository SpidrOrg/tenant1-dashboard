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
    :class="`tw-w-1/6 tw-cursor-pointer ${
      cardData.isActive
        ? 'tw-border-x tw-border-t tw-border-b-4 tw-border-solid tw-border-brand-primary tw--mb-5'
        : 'tw-border tw-border-solid tw-border-brand-secondary-10 tw-opacity-60'
    }`"
  >
    <CardsListItem :data="cardData" :options="options" />
    <div class="tw-flex tw-w-full tw-justify-center" v-if="cardData.isActive">
      <div
        class="tw-w-0 tw-h-0 tw-border-solid tw-border-t-brand-primary"
        style="
          border-left-width: 16px;
          border-left-color: transparent;
          border-right-width: 16px;
          border-right-color: transparent;
          border-top-width: 16px;
        "
      ></div>
    </div>
  </div>
</template>
