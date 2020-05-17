<template>
  <div>
    <Header></Header>

    <TableCards v-bind="{members, cardMode, isOpen, highest, lowest, remove}"></TableCards>

    <Sidebar></Sidebar>

    <div v-if="members.length !== 0">
      <button
        class="a-btn a-btn--center"
        v-bind:class="{'a-btn--active': isOpen}"
        v-on:click="handleResolve"
      >{{ isOpen ? 'Hide Cards' : 'Show Cards'}}</button>
    </div>

    <div v-if="!team" class="a-not-set">
      <p>You have not yet created or selected a team.</p>
      <router-link class="a-btn" :to="{ name: 'home', params: { tab: 'create' } }">Create Team</router-link>
    </div>
    <p class="a-not-set" v-else-if="members.length === 0">No members here at the moment.</p>
  </div>
</template>

<script>
import TableCards from "../Components/TableCards";
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";
import { mapState } from "vuex";

export default {
  name: "dashboard",
  components: {
    Sidebar,
    TableCards,
    Header
  },
  computed: mapState(["user", "team", "members", "cardMode"]),
  data() {
    return {
      error: "",
      isOpen: false,
      lowest: "",
      highest: ""
    };
  },
  methods: {
    addToStats(stats, card) {
      let alreadySet = false;

      stats.forEach(item => {
        if (item.label === card) {
          item.count++;
          alreadySet = true;
        }
      });

      if (!alreadySet) {
        stats.push({ label: card, count: 1 });
      }
    },
    setStats() {
      let lowest = "";
      let highest = "";
      let stats = [];

      this.members.forEach(member => {
        if (member && member.card === "") return;

        this.addToStats(stats, member.card);

        if (!lowest && !highest) {
          lowest = member.card;
          highest = member.card;
        } else if (member.card < lowest) {
          lowest = member.card;
        } else if (member.card > highest) {
          highest = member.card;
        }
      });

      this.lowest = lowest;
      this.highest = highest;

      return stats;
    },
    handleResolve() {
      this.isOpen ? this.clear() : this.resolve();
    },
    resolve() {
      this.isOpen = true;
      const stats = this.setStats();

      this.$store.dispatch("updateTeam", { team: this.team, isLocked: true });

      const getColor = number => {
        if (number === this.highest) return "rgba(222,91,73,1)";
        else if (number === this.lowest) return "rgba(70,178,157,1)";
        else return "rgba(7,134,216,1)";
      };
    },
    clear() {
      this.members.forEach(user => {
        user &&
          this.$store.dispatch("updateUser", { user: user.name, card: "" });
      });
      this.$store.dispatch("updateTeam", { team: this.team, isLocked: false });
      this.isOpen = false;
    },
    remove(user) {
      if (user === window.localStorage.getItem("user")) {
        if (window.confirm("Do you want to remove yourself from the team?")) {
          this.$store.dispatch("removeUserFromTeam", {
            team: this.team,
            user: this.user
          });
        }
      } else {
        this.$store.dispatch("removeUserFromTeam", {
          team: this.team,
          user: this.user
        });
      }
    }
  }
};
</script>

<style lang="scss">
@import "../styles/variables";

.title {
  text-align: left;
}

.chart {
  float: left;
  width: 25%;
  margin-top: 65px;
}
</style>
