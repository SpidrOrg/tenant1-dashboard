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
import idpConfig from '@/idpConfig';

import PAGES_CONFIG from '@/navConfig';
import { PAGE_KEYS } from '@/navConfig';

import OrgLogo from '@/images/orgLogo.svg';
import OrgLogoSmall from '@/images/orgLogoSmall.svg';

import './index.css';

const app = createApp(App, { idpConfig, OrgLogo, OrgLogoSmall, PAGES_CONFIG, PAGE_KEYS });
app.component('VueDatePicker', VueDatePicker);

registerPlugins(app);

app.mount('#app');
