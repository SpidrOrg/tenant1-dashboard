/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from './parent/App.vue';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

// Composables
import { createApp } from 'vue';

// Plugins
import { registerPlugins } from '@/plugins';
import idpConfig from '@/idpConfig-dev-local';

import OrgLogo from '@/images/orgLogo.png';

import './index.css';

const app = createApp(App, { idpConfig, OrgLogo });
app.component('VueDatePicker', VueDatePicker);

registerPlugins(app);

app.mount('#app');
