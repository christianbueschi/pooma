<template>
  <section class="c-tabs">
    <div>
      <div class="c-tabs__list">
        <button
          class="c-tabs__item"
          v-for="(option, index) in options"
          :tabindex="index"
          v-on:click="option.action"
          v-bind:key="{ index }"
          v-bind:class="{ 'c-tabs__item--active': isActive === option.name }"
        >{{ option.name }}</button>
      </div>
      <section v-show="isActive === options.create.name">
        <form class="c-tabs__form" v-on:submit.prevent="onCreateTeam">
          <input
            class="c-tabs__form__input"
            type="text"
            v-model="team"
            :ref="options.create.name"
            placeholder="Team Name"
          />
          <input class="c-tabs__form__input" type="submit" value="Create" />
          <p class="c-tabs__error" v-if="error">{{ error }}</p>
        </form>
      </section>

      <section v-show="isActive === options.select.name">
        <form class="c-tabs__form" v-on:submit.prevent="onSelectTeam">
          <input
            class="c-tabs__form__input"
            type="text"
            v-model="team"
            :ref="options.select.name"
            placeholder="Team Name"
          />
          <input class="c-tabs__form__input" type="submit" value="Login" />
          <p class="c-tabs__error" v-if="error">{{ error }}</p>
        </form>
      </section>
    </div>

    <section v-show="isActive === options.join.name">
      <form class="c-tabs__form" v-on:submit.prevent="onJoinTeam">
        <input
          class="c-tabs__form__input"
          type="text"
          v-model="team"
          :ref="options.join.name"
          placeholder="Team Name"
        />
        <input class="c-tabs__form__input" type="text" v-model="user" placeholder="User Name" />
        <input class="c-tabs__form__input" type="submit" value="Login" />
        <p class="c-tabs__error" v-if="error">{{ error }}</p>
      </form>
    </section>
  </section>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "tabs",
  data() {
    return {
      isActive: "",
      error: "",
      options: {
        create: {
          name: "Create Team",
          action: this.onCreate
        },
        select: {
          name: "PO-Login",
          action: this.onSelect
        },
        join: {
          name: "Dev-Login",
          action: this.onJoin
        }
      }
    };
  },
  methods: {
    onCreate() {
      this.selectAndfocus(this.options.create);
    },

    onSelect() {
      this.selectAndfocus(this.options.select);
    },

    onJoin() {
      this.selectAndfocus(this.options.join);
    },

    selectAndfocus(item) {
      this.isActive = item.name;
      this.error = "";
      this.$nextTick(() => this.$refs[item.name].focus());
    },

    onCreateTeam() {
      this.$store
        .dispatch("createTeam", this.team)
        .then(() => this.$router.push({ name: "dashboard" }));
    },

    onSelectTeam() {
      this.$store
        .dispatch("selectTeam", this.team)
        .then(() => this.$router.push({ path: "dashboard" }));
    },

    onJoinTeam() {
      this.$store
        .dispatch("joinTeam", { team: this.team, user: this.user })
        .then(() => this.$router.push({ path: "play" }));
    },

    onResetTeam() {
      this.team = "";
      this.handleResetTeam();
    }
  },
  mounted() {
    if (this.$route.params.tab === "select")
      this.selectAndfocus(this.options.select);
    else if (this.$route.params.tab === "join")
      this.selectAndfocus(this.options.join);
    else this.selectAndfocus(this.options.create);
  }
};
</script>

<style lang="scss">
@import "../styles/variables";
@import "../styles/base";

.c-tabs {
  text-align: center;

  &__item {
    font-size: 18px;
    margin: 0 0.5rem;
    padding: 1rem;
    border: none;
    max-width: 30%;
    background-color: $light;
    color: white;
    transition: background-color 0.25s ease-in-out;
    border-radius: 8px 8px 0 0;
    cursor: pointer;

    &:focus {
      outline: none;
    }

    &--active {
      background-color: $dark;
      color: white;
    }

    @media (min-width: 672px) {
      font-size: 24px;
      min-width: 160px;
    }
  }

  &__link {
    color: $grey;
  }

  &__error {
    color: $red;
  }

  &__form {
    background-color: #324d5c;
    border-radius: 8px;
    padding: 2rem;
    max-width: 900px;
    margin: 0 auto;

    &__input {
      background: transparent;
      border: none;
      border-bottom: 1px solid $grey;
      padding: 1rem;
      font-size: 24px;
      display: block;
      margin: 0 auto;
      margin-bottom: 1rem;
      color: white;
      -webkit-appearance: none;

      &:focus {
        outline: none;
      }

      &[type="submit"] {
        @extend .a-btn;
        margin: 0 auto 1rem auto !important;
      }

      &::placeholder {
        /* Chrome, Firefox, Opera, Safari 10.1+ */
        color: #20323c;
      }

      &:-ms-input-placeholder {
        /* Internet Explorer 10-11 */
        color: #20323c;
      }

      &::-ms-input-placeholder {
        /* Microsoft Edge */
        color: #20323c;
      }
    }
  }
}
</style>
