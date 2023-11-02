<script>
import _ from 'lodash';
import jwt_decode from 'jwt-decode';
import TheSckeleton from './components/TheSckeleton/TheSckeleton.vue';
import LoginPage from './pages/LoginPage.vue';
import { setIdpData, getAuthDetails } from './idpUtils';
import PAGES_CONFIG, { PAGE_KEYS } from '@/navConfig';
import fetchUIConfig from '@/api/fetchUIConfig';

export default {
  name: 'App',
  components: {
    LoginPage,
    TheSckeleton,
  },
  props: {
    idpConfig: {
      type: Object,
      required: true,
    },
    OrgLogo: {
      type: String,
      required: true,
    },
    OrgLogoSmall: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isLoggedIn: false,
      loading: true,
      loggedInUserData: {},
      PAGES_CONFIG: {},
      PAGE_KEYS: {},
      uiConfig: {},
      pageConfigLoaded: false
    };
  },
  created() {
    setIdpData(this.idpConfig);
  },
  async mounted() {
    const { token, userPoolId } = await getAuthDetails();
    this.userHasAuthenticated(!!token, token, userPoolId);
  },
  methods: {
    userHasAuthenticated: async function (autheticated, token, usrPoolId){
      this.isLoggedIn = autheticated;
      this.loading = false;
      if (autheticated) {
        this.loggedInUserData.token = token;
        this.loggedInUserData.userPoolId = usrPoolId;
        const jwtDecoded = jwt_decode(token);
        this.loggedInUserData.deocdedJWT = jwtDecoded;
        this.loggedInUserData.isAdmin =
          _.filter(
            _.get(jwtDecoded, "['cognito:groups']", []),
            (v) => _.toLower(v) === 'admin'
          ).length > 0;
        this.loggedInUserData.userName =
          _.get(jwtDecoded, 'name', null) ?? _.get(jwtDecoded, 'email', '---');

        const uiConfig = await fetchUIConfig();
        this.uiConfig = uiConfig;
        this.pageConfigLoaded = true;
        this.PAGES_CONFIG = PAGES_CONFIG(uiConfig, this.loggedInUserData.isAdmin);
        this.PAGE_KEYS = PAGE_KEYS(uiConfig, this.loggedInUserData.isAdmin)
      } else {
        this.loggedInUserData.token = null;
        this.loggedInUserData.userPoolId = null;
      }
    },
    handleUiSettingUpdate: async function(uiConfigRes){
      this.pageConfigLoaded = false;
      let uiConfig = uiConfigRes;
      if (!uiConfig){
        uiConfig = await fetchUIConfig();
      }
      this.uiConfig = uiConfig;
      this.pageConfigLoaded = true;
      this.PAGES_CONFIG = PAGES_CONFIG(uiConfig, this.loggedInUserData.isAdmin);
      this.PAGE_KEYS = PAGE_KEYS(uiConfig, this.loggedInUserData.isAdmin)
    }
  },
};
</script>

<template>
  <LoginPage v-if="!isLoggedIn && !loading" />
  <TheSckeleton
    v-if="isLoggedIn && !loading && pageConfigLoaded"
    :org-logo="OrgLogo"
    :org-logo-small="OrgLogoSmall"
    :userdata="this.loggedInUserData"
    :PAGES_CONFIG="PAGES_CONFIG"
    :PAGE_KEYS="PAGE_KEYS"
    :uiConfig='uiConfig'
    :onUiSettingUpdate='handleUiSettingUpdate'
  />
  <div style='display: flex; align-items: center; justify-content: center; height: 100vh;' v-if='isLoggedIn && !pageConfigLoaded'>
    <v-progress-circular
      indeterminate
      color="#7823DC"
      :size="80"
      :width="10"
    />
  </div>
</template>
