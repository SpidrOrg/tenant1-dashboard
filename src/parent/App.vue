<script>
import _ from "lodash";
import jwt_decode from "jwt-decode";
import TheSckeleton from "./components/TheSckeleton/TheSckeleton.vue";
import LoginPage from "./pages/LoginPage.vue";
import {setIdpData, getAuthDetails} from "./idpUtils";

export default {
  name: "App",
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
      required: true
    }
  },
  data() {
    return {
      isLoggedIn: false,
      loading: true,
      loggedInUserData: {},
    };
  },
  created() {
    setIdpData(this.idpConfig);
  },
  async mounted(){
    const {token, userPoolId} = await getAuthDetails();
    this.userHasAuthenticated(!!token, token, userPoolId)
  },
  methods: {
    userHasAuthenticated(autheticated, token, usrPoolId){
      this.isLoggedIn = autheticated;
      this.loading = false;
      if (autheticated){
        this.loggedInUserData.token = token
        this.loggedInUserData.userPoolId = usrPoolId
        const jwtDecoded = jwt_decode(token);
        this.loggedInUserData.deocdedJWT = jwtDecoded
        this.loggedInUserData.isAdmin = _.filter(_.get(jwtDecoded, "['cognito:groups']", []), v =>  v === 'admin').length > 0
        this.loggedInUserData.userName = _.get(jwtDecoded, "email", "");
      } else {
        this.loggedInUserData.token = null
        this.loggedInUserData.userPoolId = null
      }
    }
  }
};
</script>

<template>
  <LoginPage v-if="!isLoggedIn && !loading" />
  <TheSckeleton v-if="isLoggedIn && !loading" :org-logo="OrgLogo" />
</template>
