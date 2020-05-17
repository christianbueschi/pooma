<template>
  <aside class="c-sidebar">
    <button
      class="c-sidebar__toggle"
      v-on:click="onToggleNav()"
      v-bind:class="{ 'c-sidebar__toggle--close': isActive }"
    >
      <span></span>
      <span></span>
    </button>

    <section class="c-sidebar__inner" v-bind:class="{ 'is-open': isActive }">
      <header class="c-sidebar__header">
        <section class="c-sidebar__section">
          <h6 class="c-sidebar__label">Team</h6>
          <h2
            class="c-sidebar__title"
            v-bind:class="{ 'not-set': !team }"
          >{{ team ? team : 'No team set' }}</h2>
        </section>
        <section class="c-sidebar__section">
          <h6 class="c-sidebar__label">User</h6>
          <h2
            class="c-sidebar__title"
            v-bind:class="{ 'not-set': !user }"
          >{{ user ? user : 'No user set' }}</h2>
        </section>
        <section class="c-sidebar__section" v-if="team && !user">
          <h6 class="c-sidebar__label">Card Mode</h6>
          <label for="fibonacci" class="c-sidebar__input__label">
            <input
              type="radio"
              name="cardMode"
              id="fibonacci"
              value="fibonacci"
              v-model="cardMode"
              v-on:change="onChangeCardMode"
              class="c-sidebar__input"
            />
            Fibonacci
          </label>
          <label for="t-shirt" class="c-sidebar__input__label">
            <input
              type="radio"
              name="cardMode"
              id="t-shirt"
              value="t-shirt"
              v-model="cardMode"
              v-on:change="onChangeCardMode"
              class="c-sidebar__input"
            />
            T-Shirt
          </label>
        </section>
      </header>
      <nav class="c-sidebar__nav">
        <router-link class="c-sidebar__nav__link" to="/">
          <i class="fas fa-home"></i>
          Home
        </router-link>
        <router-link class="c-sidebar__nav__link" to="/dashboard">
          <i class="fas fa-tachometer-alt"></i>
          Dashboard
        </router-link>
        <router-link class="c-sidebar__nav__link" to="/play">
          <i class="fas fa-play"></i>
          Play
        </router-link>
        <div
          v-if="user || team"
          class="c-sidebar__nav__link c-sidebar__nav__link--signout"
          v-on:click="onResetUser"
        >
          <i class="fas fa-sign-out-alt"></i>
          Sign Out
        </div>
      </nav>

      <a
        class="c-sidebar__nav__link c-sidebar__nav__link--reload"
        v-if="onLocalhost"
        v-on:click="onReload"
      >
        <i class="fas fa-redo"></i>
        Reload
      </a>

      <a class="c-sidebar__contact" href="mailto:hello@pooma.app">hello@pooma.app</a>
    </section>
  </aside>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "sidebar",
  data() {
    return {
      isActive: false,
      cardMode: "fibonacci",
      onLocalhost:
        window.location.host.indexOf("serveo") >= 0 ||
        window.location.host.indexOf("localhost") >= 0
          ? true
          : false
    };
  },
  computed: mapState(["user", "team"]),
  methods: {
    onToggleNav() {
      this.isActive = !this.isActive;
    },

    onResetUser() {
      this.$store.dispatch("removeUser", { team: this.team, user: this.user });
      this.$router.push({ path: "/" });
    },

    onReload() {
      window.location.reload(true);
    },

    onChangeCardMode() {
      this.$store.dispatch("updateCardMode", {
        team: this.team,
        cardMode: this.cardMode
      });
    }
  }
};
</script>

<style lang="scss">
@import "../styles/variables";

.c-sidebar {
  &__toggle {
    position: absolute;
    right: 0;
    top: 27px;
    z-index: 100;
    width: 50px;
    height: 35px;
    border: none;
    background: $dark;
    box-shadow: 0px 5px 30px -5px rgb(0, 0, 0);
    border-radius: 8px 0 0 8px;
    cursor: pointer;

    &:focus {
      outline: none;
    }

    span {
      position: absolute;
      width: 20px;
      height: 3px;
      background-color: white;
      border-radius: 5px;
      transition: all 0.25s ease-in-out;

      &:first-child {
        top: 12px;
        left: 10px;
      }

      &:last-child {
        bottom: 12px;
        left: 20px;
      }
    }

    &--close {
      background: transparent;

      span {
        &:first-child {
          top: 17px;
          left: 17px;
          transform: rotate(45deg);
        }

        &:last-child {
          top: 17px;
          left: 17px;
          transform: rotate(-45deg);
        }
      }
    }

    @media (min-width: 880px) {
      display: none;
    }
  }

  &__inner {
    position: fixed;
    background: #324d5c;
    right: -300px;
    top: 0;
    width: 250px;
    height: 100vh;
    padding: 50px 60px 50px 40px;
    z-index: 99;
    box-shadow: 0px 5px 30px -5px rgb(0, 0, 0);

    transition: right 0.25s ease-in-out;

    &.is-open {
      right: 0;
    }

    @media (min-width: 880px) {
      right: 0;
    }
  }

  &__header {
    margin-bottom: 4rem;
  }

  &__label {
    color: white;
    font-size: 14px;
    text-align: left;
    font-weight: 300;
    margin: 0;
    padding-bottom: 2px;
    border-bottom: 1px solid white;
  }

  &__input {
    &__label {
      display: block;
      color: white;
      cursor: pointer;

      &:first-of-type {
        margin-top: 0.5rem;
      }
    }
  }

  &__title {
    color: white;
    font-size: 26px;
    text-align: left;
    font-weight: 300;
    margin: 0;

    &.not-set {
      font-style: italic;
      font-size: 14px;
      margin-top: 0.5rem;
    }
  }

  &__section {
    margin-bottom: 2rem;
  }

  &__nav {
    &__link {
      display: block;
      margin-bottom: 0.5rem;
      text-decoration: none;
      color: white;
      cursor: pointer;
      position: relative;
      padding-left: 1.5rem;

      &--signout {
        margin-top: 2rem;
      }

      i {
        position: absolute;
        left: 0;
      }

      &.router-link-exact-active {
        color: #46b29d;
      }
    }
  }

  &__contact {
    color: white;
    position: absolute;
    bottom: 20px;
  }
}
</style>
