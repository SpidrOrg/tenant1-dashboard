import { defineComponent, h } from 'vue';

import { GChart } from 'vue-google-charts';

export default defineComponent({
  name: 'GoogleChart',
  props: {
    data: {
      type: Array,
      required:true
    },
    options: Object,
    type: String
  },
  components: {
    GChart,
  },
  setup(props) {
    return () =>
      h(GChart, {
        data: props.data,
        options: props.options,
        type: props.type,
      });
  },
});
