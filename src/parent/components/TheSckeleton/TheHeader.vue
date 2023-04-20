<script>
import AnyUser from '../../public/anyUser.png';
import { logout } from '../../idpUtils';

export default {
  name: 'TheHeader',
  data() {
    return {
      AnyUser,
      dropdownMenuIsShown: false,
      selectedOption: 1,
      // menuSelected: false, //todo
    };
  },
  props: {
    userdata: {
      type: Object,
      required: true,
    },
  },
  methods: {
    hideDropdownMenu() {
      this.dropdownMenuIsShown = false;
    },
    dropdownClickHandler(event) {
      event.stopPropagation();
      this.dropdownMenuIsShown = true;
      const screen = document.querySelector('.screen');
      screen.addEventListener('click', this.hideDropdownMenu, { once: true });
    },
    // onMenuSelect() {
    //   //todo
    //   this.menuSelected = true;
    //   try {
    //     const event = document.createEvent('MouseEvents');
    //     event.initMouseEvent('mousedown', true, true, window);
    //     const element = document.getElementById('menu-actions');
    //     element.dispatchEvent(event);
    //   } catch (e){console.log(e)}
    // },
    handleLogout() {
      //todo
      logout();
    },
  },
};
</script>

<template>
  <div class="account-control">
    <div class="control-section">
      <div class="dropdown-container">
        <button class="dropdown-button" @click="dropdownClickHandler">
          <div class="user-icon">
            <img :src="AnyUser" />
          </div>
          <span class="dropdown-text">My Account</span>
          <div class="down-arrow" />
        </button>
        <div class="dropdown-menu" v-if="dropdownMenuIsShown">
          <a :class="selectedOption === 1 ? 'selected' : 'menu-option'">
            Hello! {{ userdata.userName
            }}{{ userdata.isAdmin ? '(Admin)' : '' }}
          </a>
          <a
            :class="selectedOption === 2 ? 'selected' : 'menu-option'"
            @click="handleLogout"
            >Logout</a
          >
        </div>
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

.control-section {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 150px;
}

.dropdown-container {
  position: relative;
  display: inline-block;
}

.dropdown-button {
  display: flex;
  column-gap: 12px;
}

.user-icon {
  height: 16px;
  width: 16px;
  padding-top: 2px;
}

.down-arrow {
  border: solid #7823dc;
  border-width: 0 2px 2px 0;
  display: inline-block;
  height: 4px;
  padding: 4px;
  transform: rotate(45deg);
  margin-top: 4px;
}

.dropdown-text {
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: #000000;
}

.dropdown-menu {
  position: absolute;
  right: 0;
  background-color: #f5f5f5;
  min-width: 220px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.2);
  z-index: 9999;
  cursor: pointer;
}

.dropdown-menu a {
  display: flex;
  align-items: center;
  color: black;
  padding: 12px;
  text-decoration: none;
  font-weight: 400;
  font-size: 16px;
  line-height: 21px;
}

.dropdown-menu a.selected {
  font-weight: 500;
  background-color: #e6d2fa;
}

.dropdown-menu a.menu-option:hover {
  background-color: #ededed;
}
</style>
