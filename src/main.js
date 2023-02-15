/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from './parent/App.vue'

// Composables
import { createApp } from 'vue'

// Plugins
import { registerPlugins } from '@/plugins'
import idpConfig from "@/idpConfig";

import OrgLogo from "@/images/orgLogo.png";

import "./index.css"

const app = createApp(App, {idpConfig, OrgLogo})

registerPlugins(app)

app.mount('#app')
