<template>
  <div>
    <Header></Header>

    <Cards v-if="user"></Cards>

    <Sidebar></Sidebar>
    <div v-if="!user" class="a-not-set">
      <p>You have not yet joined a team.</p>
      <router-link class="a-btn" :to="{ name: 'home', params: {tab: 'join' } }">Join Team</router-link>
    </div>
  </div>
</template>

<script>
import Cards from "../Components/Cards";
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";
import { mapState } from "vuex";

export default {
  name: "play",
  components: { Cards, Sidebar, Header },
  computed: mapState(["user"])
};
</script>

