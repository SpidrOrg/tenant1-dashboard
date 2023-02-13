<script>
export default {
  name: "TheHeadline",
  data() {
    return {
      actionWords: ["Build", "Create", "Design"],
      currentActionWordIndex: 0,
      intervalRef: null,
    };
  },
  computed: {
    actionClass() {
      switch (this.actionWords[this.currentActionWordIndex]) {
        case "Build":
          return "build";
        case "Create":
          return "create";
        case "Design":
          return "design";
        default:
          return "";
      }
    },
  },
  created() {
    this.intervalRef = setInterval(() => {
      if (this.currentActionWordIndex < this.actionWords.length - 1) {
        this.currentActionWordIndex += 1;
      } else {
        this.currentActionWordIndex = 0;
      }
    }, 1500);
  },
  beforeUnmount() {
    clearInterval(this.intervalRef);
  },
};
</script>

<template>
  <section class="mb-16">
    <h1 class="mb-14 text-8xl font-bold tracking-tighter">
      <span :class="actionClass">{{ actionWords[currentActionWordIndex] }}</span> <br />
      for everyone
    </h1>
    <h2 class="text-3xl font-light">Find your next job at Bobo Corp.</h2>
  </section>
</template>

<style scoped>
.build {
  color: #1a73e8;
}

.create {
  color: #34a853;
}

.design {
  color: #f9ab00;
}
</style>
