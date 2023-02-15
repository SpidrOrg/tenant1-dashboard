<script>
import AnyUser from "../../public/anyUser.png";
import DownArrow from "../../public/downArrow.png"
import {logout} from "../../idpUtils";
export default {
  name: "TheHeader",
  data(){
    return {
      AnyUser,
      DownArrow,
      menuSelected: false //todo
    }
  },
  methods: {
    onMenuSelect(){
      //todo
      this.menuSelected = true;
      try {
        document.getElementById('menu-actions').dispatchEvent(document.createEvent('MouseEvents').initMouseEvent('mousedown', true, true, window));
      } catch (e){console.log("e")}
    },
    handleLougut(){
      //todo
      this.menuSelected = false;
      logout()
    },
    handleFocusOut(){
      //todo
      this.menuSelected = false;
    }
  }
}
</script>

<template>
  <div class="account-control">
    <div class="control-section">
      <div class="user-icon">
        <img :src="AnyUser"/>
      </div>
      <div>
        My Account
      </div>
      <div class="down-arrow">
        <img :src="DownArrow" @click="onMenuSelect" />
        <select v-if="menuSelected === true" id="menu-actions" class="menu-options" @change="handleLougut" @focusout="handleFocusOut">
          <option :selected="true">Options</option>
          <option :selected="false">Logout</option>
        </select>
      </div>
    </div>
  </div>
</template>

<style>
.account-control {
  display: flex;
  margin-left: auto;
  align-items: center;
  height: 3rem;
}
.user-icon {
  height: 18px;
  width: 18px;
}
.control-section {
  display: flex;
  align-items: center;
  gap: 10px;
}
.down-arrow {
  width: 14px;
  height: 8px;
}
.menu-options {
  margin-left: -60px;
}
</style>
