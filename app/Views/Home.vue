<template>
  <div>
    <Header></Header>

    <section class="v-home__copy">
      <p>
        <span>Scrum Planning Poker at it's finest!</span>
        <span>Virtually estimateyour team stories with ease 🎉</span>
      </p>
    </section>

    <Tabs></Tabs>

    <Sidebar></Sidebar>

    <AddToHomeScreen></AddToHomeScreen>
  </div>
</template>

<script>
import Tabs from "../Components/Tabs";
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";
import AddToHomeScreen from "../Components/AddToHomeScreen";

export default {
  name: "app",
  components: { Tabs, Sidebar, Header, AddToHomeScreen }
};
</script>

<style lang="scss">
@import "../styles/base";

.v-home {
  &__copy {
    color: #333;
    margin: 0 auto;
    font-size: 20px;
    margin-bottom: 4rem;
    text-align: center;

    @media (min-width: 672px) {
      span {
        display: block;
      }
    }
  }
}
</style>
