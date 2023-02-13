<script>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

export default {
  name: "TheSubnav",
  components: { FontAwesomeIcon },
};
</script>

<template>
  <div class="h-16 w-full border-b border-solid border-brand-gray-1 bg-white">
    <div class="flex h-full items-center px-8">
      <div>
        <font-awesome-icon class="mr-3" :icon="['fas', 'search']" />
        <span><span class="text-brand-green-1">1653 </span> jobs matched</span>
      </div>
    </div>
  </div>
</template>
