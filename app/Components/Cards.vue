<template>
  <section>
    <ul class="o-cardlist">
      <li
        class="o-cardlist__item"
        v-for="(card, index) in cards"
        v-bind:key="index"
        v-on:click="onClickCard(index)"
      >
        <span v-bind:class="{ small: card.length > 3 }">{{ card }}</span>
      </li>
      <li
        class="o-cardlist__ready"
        v-bind:class="{ 'is-locked': locked }"
        v-if="hideCards"
        v-on:click="onClickReady()"
      >
        <p class="o-cardlist__ready__inner" v-if="locked">Locked</p>
        <p class="o-cardlist__ready__inner" v-if="!locked">Ready</p>
      </li>
    </ul>
  </section>
</template>

<script>
import { mapState } from "vuex";
import { FIBONACCI_NUMBERS, T_SHIRT_SIZES } from "../Variables";

export default {
  name: "cards",
  computed: mapState(["locked", "card", "user", "cardMode"]),
  data() {
    return {
      cards:
        this.$store.state.cardMode === "fibonacci"
          ? FIBONACCI_NUMBERS
          : T_SHIRT_SIZES,
      activeCard: "",
      hideCards: this.locked
    };
  },
  methods: {
    onClickCard(card) {
      card = card === 0 ? "0" : card;
      this.activeCard = card;
      this.$store
        .dispatch("updateUser", { user: this.user, card: card })
        .then(() => this.toggleCards(false));
    },

    onClickReady() {
      if (this.locked) return;
      this.activeCard = "";
      this.$store
        .dispatch("updateUser", { user: this.user, card: "" })
        .then(() => this.toggleCards(false));
    },
    handleClick(card) {
      card = card === 0 ? "0" : card;
    },
    toggleCards(isLocked) {
      this.activeCard = this.card;

      if (isLocked || this.activeCard) {
        this.hideCards = true;
      } else {
        this.hideCards = false;
      }
    },
    changeCardMode(cardMode) {
      cardMode === "fibonacci"
        ? (this.cards = FIBONACCI_NUMBERS)
        : (this.cards = T_SHIRT_SIZES);
    }
  },

  watch: {
    cardMode: function(cardMode) {
      this.changeCardMode(cardMode);
    },
    locked: function(isLocked) {
      this.toggleCards(isLocked);
    }
  }
};
</script>

<style lang="scss">
@import "../styles/variables";

.o-cardlist {
  position: relative;
  overflow: hidden;
  display: block;
  padding: 0;
  width: 900px;
  max-width: 100%;
  margin: 0 auto;

  &__item {
    float: left;
    padding: 1rem;
    margin: 0 0.5rem 0.5rem 0;
    list-style: none;
    font-size: 2rem;
    text-align: center;
    line-height: 2rem;
    background: $light;
    cursor: pointer;
    transition: transform 0.25s ease-in-out;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;

    &:before {
      content: "";
      padding-bottom: 100%;
    }

    @media (min-width: 320px) and (max-width: 768px) {
      width: calc(33% - 0.35rem);

      &:nth-child(3n) {
        margin-right: 0;
      }
    }

    @media (min-width: 769px) {
      width: calc(20% - 0.5rem);

      &:nth-child(5n) {
        margin-right: 0;
      }

      &:nth-child(5n + 1) {
        clear: left;
      }
    }

    span.small {
      font-size: 1.2rem;
      line-height: 1.4rem;
    }

    &:hover {
      transform: scale(1.08);

      &.is-locked {
        transform: scale(1);
        cursor: default;
      }
    }
  }

  &__ready {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: $dark;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    &.is-locked {
      background-color: $red;
      color: white;
      cursor: default;
    }

    &__inner {
      color: white;
      font-size: 24px;
    }
  }
}
</style>
