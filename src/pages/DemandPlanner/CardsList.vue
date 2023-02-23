<script>
import CardsListItem from './CardsListItem.vue'
export default {
  name: "CardsList",
  components: {
    CardsListItem
  },
  props: {
    data: {
      type: Array,
      required: true
    },
    activeCard: {
      type: Number,
      required: true
    }
  },
  emits: ['setActiveCard']
}
</script>

<template>
  <v-card v-for="(cardData, index) in data" :key="cardData.period"
          @click="$emit('setActiveCard', index)"
          class="tw-w-1/4 tw-shadow-none"
          :style="(activeCard === index) ? 'border-width: 1px 1px 6px 1px; border-style: solid; border-color: #7823DC;': 'border:1px solid #E5E5EF;'"
  >
    <CardsListItem :data="cardData" />
  </v-card>
</template>
