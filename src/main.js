import { createApp } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import App from "../../spidr/src/App.vue";
import router from "@/router";
// import "@/index.css";
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
})


library.add(faSearch);

createApp(App).use(router).use(vuetify).component("font-awesome-icon", FontAwesomeIcon).mount("#app");

