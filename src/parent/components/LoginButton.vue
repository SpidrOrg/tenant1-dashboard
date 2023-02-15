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
  <button :class="type">
    {{ label }}
  </button>
</template>

<style scoped>
button {
  padding-left: 1.25rem;
  padding-right: 1.25rem;
  font-weight: 500;
}

.primary {
  width: 152px;
  height: 40px;
  border-radius: 0px;
  color: #ffffff;
  --tw-bg-opacity: 1;
  background-color: #7823DC;
  --tw-shadow: 0 0 3px 3px #7823DC;
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-shadow);
}

.secondary {
  --tw-text-opacity: 1;
  color: rgb(25 103 210 / var(--tw-text-opacity));
}
</style>
