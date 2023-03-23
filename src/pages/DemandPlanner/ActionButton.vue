<script>
export default {
  name: 'ActionButton',
  props: {
    variance: {
      type: Number,
      required: true,
    },
  },
  methods: {
    getColorCode(n) {
      if (Math.abs(n) >= 20) {
        return '#DC3545';
      }
      if (Math.abs(n) >= 6) {
        return '#FF9900';
      }
      return '#04BB46';
    },
    getActionButtonLabel(n) {
      if (Math.abs(n) >= 20) {
        return 'Review';
      }
      if (Math.abs(n) >= 6) {
        return 'Watch List';
      }
      return 'No Action';
    },
  },
};
</script>

<template>
  <v-btn
    variant="outlined"
    rounded="pill"
    size="large"
    :color="getColorCode(variance)"
  >
    <v-icon
      :icon="Math.abs(variance) >= 20 ? 'mdi-alert-circle' : 'mdi-circle'"
      start
      :color="getColorCode(variance)"
      size="large"
    />
    <span class="tw-text-black tw-normal-case tw-font-medium tw-text-base">
      {{ getActionButtonLabel(variance) }}
    </span>
    <v-icon icon="mdi-chevron-right" end color="black" size="large" />
  </v-btn>
</template>
