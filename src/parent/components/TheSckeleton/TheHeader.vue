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
      items:[{title:'Hi Admin!'},{title:'Logout'}]
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
    handleLogout(optionSelected){
      //todo
      console.log(optionSelected);
      if(optionSelected == 'Logout'){
        logout()
      }      
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
        <v-menu>
          <template v-slot:activator="{ props }">
          <v-btn variant="text" prepend-icon="mdi-account" v-bind="props">
            My Account
          </v-btn>
      </template>
      <v-list v-model="optionSelected">
        <v-list-item
          v-for="(item, index) in items"
          :key="index"
          :value="index"
        >
          <v-list-item-title @click="handleLogout(item.title)">{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
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
</style>
