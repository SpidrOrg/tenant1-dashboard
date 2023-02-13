<script>
export default {
  name: "ActionButton",
  props: {
    label: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: "primary",
      required: false,
      validator(value) {
        const acceptedValues = ["primary", "secondary"];
        return acceptedValues.indexOf(value) >= 0;
      },
    },
  },
  data() {
    return {
      primary: false,
    };
  },
};
</script>

<template>
  <button :class="type">
    {{ label }}
  </button>
</template>

<style scoped>
button {
  @apply px-5 py-3 font-medium;
}

.primary {
  @apply rounded bg-brand-blue-1 text-white hover:shadow-blue;
}

.secondary {
  @apply bg-transparent text-brand-blue-1 hover:bg-brand-blue-2 hover:text-white;
}
</style>
