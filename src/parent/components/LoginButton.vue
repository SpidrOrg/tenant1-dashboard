<script>
export default {
  name: "LoginButton",
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
};
</script>

<template>
  <button :class="`tw-px-4 tw-py-2 tw-text-white ${type === 'primary' ? 'tw-bg-brand-primary' : ''}`">
    {{label}}
  </button>
</template>
