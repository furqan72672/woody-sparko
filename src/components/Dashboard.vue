<template>
  <div>
    <v-app-bar app dark color="primary" elevate-on-scroll>
      <v-app-bar-nav-icon @click="drawer = !drawer"/>

      <v-app-bar-title>Woody Mobile Service</v-app-bar-title>
      <v-spacer/>

      <profile-popup/>
    </v-app-bar>
    <v-main class="main-bg">
      <v-container>
        <router-view/>
      </v-container>
    </v-main>
    <v-navigation-drawer v-model="drawer" app>
      <img src="../assets/logo.webp" alt="logo" class="logo" height="70"/>
      <v-divider/>
      <template v-for="(route, key) in routes">
        <v-list-item
            v-if="route.isVisible"
            :key="key"
            class="route"
            color="#f21933"
            active-class="route--active"
            exact
            dense
            :to="route.to"
        >
          <v-list-item-icon>
            <v-icon v-text="route.icon"/>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="route.title"/>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-navigation-drawer>
  </div>
</template>

<script>
import ProfilePopup from "./ProfilePopup";
import {getUser} from "@/utils/local";

export default {
  name: 'Dashboard',
  components: {ProfilePopup},
  data: () => ({
    drawer: true,
    user: {},
  }),
  methods: {
    getUser
  },
  computed: {
    routes() {
      return [
        {
          to: '/',
          title: 'Dashboard',
          icon: 'mdi-view-dashboard-variant',
          isVisible: true
        },
        {
          to: '/appointments',
          title: 'Appointments',
          icon: 'mdi-calendar',
          isVisible: true
        },
        {
          to: '/time-slots',
          title: 'Time Slots',
          icon: 'mdi-clock',
          isVisible: true
        },
        {
          to: '/settings',
          title: 'Settings',
          icon: 'mdi-cog',
          isVisible: true
        }
      ];
    }
  }
};
</script>

<style lang="sass" scoped>
.logo
  display: block
  margin: 5px auto
  border-radius: 10px

.route
  margin: 5px
  text-align: left
  overflow: hidden
  border-radius: 4px
  font-size: 20px !important
  font-family: "Roboto", sans-serif

  i
    font-size: 20px

  &--active i
    color: inherit

  &--active
    color: #495db7

.main-bg
  background: linear-gradient(to bottom, #23277c 300px, white 300px)
  //background: linear-gradient(to bottom, url("../assets/bg.webp") 300px, white 300px)
</style>
