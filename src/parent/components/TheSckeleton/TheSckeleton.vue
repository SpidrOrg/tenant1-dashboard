<script>
import SideBar from './SideBar.vue';
import TheHeader from './TheHeader.vue';

export default {
  name: 'TheSckeleton',
  components: {
    SideBar,
    TheHeader,
  },
  props: {
    orgLogo: {
      type: String,
      required: true,
    },
    userdata: {
      type: Object,
      required: false,
    },
  },
  data(){
    return {
      mini:true,
      org_logo: '/src/images/org_logo.png'
    }
  },
  methods:{
    toggleSidebar(){
      if(window.screen.availWidth>=1420)
      return;
      // if (this.mini) {
      document.getElementById("mySidebar").style.minWidth = "13rem";
      //document.getElementById("mySidebar").style.width = "10%"; 
      document.getElementById("mySidebar").style.maxWidth = "10%";
      document.getElementById("mySidebar").style.zIndex = "9999";
      //document.getElementById("mySidebar").style.width = "auto";
      //document.getElementById("main").style.marginLeft = "250px";
      this.mini = false;
      // } else {
      //   document.getElementById("mySidebar").style.minWidth = "0px";
      //  //document.getElementById("mySidebar").style.width = "70px";
      //  document.getElementById("mySidebar").style.maxWidth = "48px";
      // //document.getElementById("main").style.marginLeft = "100px";
      // this.mini = true;
      // }
    },
    toggleSidebarOff() {
      if(window.screen.availWidth>=1420)
      return;
      document.getElementById("mySidebar").style.minWidth = "0px";
       //document.getElementById("mySidebar").style.width = "70px";
       document.getElementById("mySidebar").style.maxWidth = "48px";
      //document.getElementById("main").style.marginLeft = "100px";
      this.mini = true;
    }
  }
};
</script>

<template>
  <div class="screen">
    <div class="sidebar" @mouseover="toggleSidebar" @mouseout="toggleSidebarOff" id="mySidebar">
      <SideBar :org-logo="!mini ? orgLogo : org_logo" />
    </div>
    <div class="main-area">
      <div class="control-container">
        <div class="control-section">
          <TheHeader :userdata="userdata" />
        </div>
      </div>
      <div class="content-container">
        <router-view :userdata="userdata" />
      </div>
      <footer class="footer">
        <div class="footer-copy-right">Copyright @ Kearney 2023</div>
      </footer>
    </div>
  </div>
</template>

<style scoped>
@media screen and (min-width: 1200px)  and (max-width : 1400px) {
  .sidebar {
    display: flex;
    flex-direction: column;
    /* min-width: 13rem; */
     max-width: 48px; 
    /* position: fixed; */
    /* z-index: 9999; */
    padding-top: 60px;
    white-space: nowrap;
    overflow-x: hidden;
    transition: 0.5s;
    z-index: 9999;
    position: fixed;
    height: 100%;
    background: white;
    box-shadow: rgba(0, 0, 0, 0.4) 0px 8px 16px;
    top: 0px;
  }
    .main-area {
    flex: 1 1 auto;
    margin-left: 48px;
  }
}
@media screen and (min-width: 1440px) {
  .sidebar {
    display: flex;
    flex-direction: column;
    min-width: 13rem;
    width: 10%;
      /* display: flex;
      flex-direction: column;
      /* min-width: 13rem; 
      width: 10%;
      width: 80px;
      /* position: fixed; 
      z-index: 1;
      padding-top: 60px;
      white-space: nowrap;
      overflow-x: hidden;
      transition: 0.5s; */

  }
}
.screen {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: scroll;
}

.main-area {
  flex: 1 1 auto;
}
.control-container {
  display: flex;
  --tw-bg-opacity: 1;
  background-color: rgb(245 245 245 / var(--tw-bg-opacity));
  border-bottom-width: 1px;
  border-style: solid;
  --tw-border-opacity: 1;
  border-color: rgb(219 219 219 / var(--tw-border-opacity));
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}
.control-section {
  display: flex;
  width: 100%;
}
.content-container {
  display: flex;
  padding: 1rem;
  flex-direction: column;
  --tw-bg-opacity: 1;
  background-color: rgb(245 245 245 / var(--tw-bg-opacity));
}
.footer {
  display: flex;
  width: 100%;
  height: 3rem;
  padding-left: 1rem;
  padding-right: 1rem;
  border-top-width: 1px;
  border-style: solid;
  --tw-border-opacity: 1;
  border-color: rgb(219 219 219 / var(--tw-border-opacity));
  --tw-bg-opacity: 1;
  background-color: rgb(245 245 245 / var(--tw-bg-opacity));
}
.footer-copy-right {
  margin-left: auto;
  display: flex;
  align-items: center;
}
</style>
