<script>
import AnyUser from "../../public/anyUser.png";
import DownArrow from "../../public/downArrow.png"
import {logout} from "../../idpUtils";
import _ from 'lodash';

export default {
  name: "TheHeader",
  data(){
    return {
      AnyUser,
      DownArrow,
      menuSelected: false, //todo
      optionSelected:'',
    }
  },
  props: {
    userdata: {
      type: Object,
      required:true
    }
  },
  methods: {
    onMenuSelect(){
      //todo
      this.menuSelected = true;
      // try {
      //   const event = document.createEvent('MouseEvents');
      //   event.initMouseEvent('mousedown', true, true, window);
      //   const element = document.getElementById('menu-actions');
      //   element.dispatchEvent(event);
      // } catch (e){console.log(e)}
    },
    handleLogout(){
      //todo
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
      <!-- <div class="user-icon">
         <img :src="AnyUser"/> 
      </div> -->
      <!-- <div class="down-arrow">
        <img :src="DownArrow" @click="onMenuSelect" /> -->
        <!-- <v-select label="My Account" id="menu-actions" v-model="optionSelected" class="menu-options" @update:model-value="handleLogout" :items="['Hello! Admin','Logout']" prepend-inner-icon="mdi-account"> -->
          <!-- <option :selected="true">{{userdata.userName}}{{userdata.isAdmin ? '(Admin)' : ''}}</option>
          <option :selected="false">Logout</option> -->
        <!-- </v-select> -->
        <div class="dropdown">
          <div style="display: flex;">
            <div class="user-icon">
              <img :src="AnyUser"/> 
            </div>
            <button class="dropbtn">
              My Account
            </button>
          </div>
          
          <div class="dropdown-content">
            <a>{{userdata.userName}}{{userdata.isAdmin ? '(Admin)' : ''}}</a>
            <a @click="handleLogout">Logout</a>
          </div>
        </div>
      <!-- </div> -->
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
  padding-top: 10px;
}
.control-section {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 150px;
}
.down-arrow {
  width: 14px;
  height: 8px;
}
.menu-options {
  margin-left: -60px;
}

.dropbtn {
  background-color: #f5f5f5;
  color: black;
  padding: 10px;
  font-size: 16px;
  border: none;
  cursor: pointer;
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #f5f5f5;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 9999;
  cursor: pointer;
}

.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

.dropdown-content a:hover {background-color: #f5f5f5}

.dropdown:hover .dropdown-content {
  display: block;
}

.dropdown:hover .dropbtn {
  background-color: #f1f1f1;
}
</style>
