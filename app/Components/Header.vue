<template>
  <h1 class="c-header__title">POOMA</h1>
</template>

<script>
export default {
  name: 'header',
};
</script>

<style lang="scss">
@import '../styles/base';

.c-header__title {
  display: inline-block;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  font-family: 'Monoton', cursive;
  font-weight: normal;
  color: #324d5c;
  text-align: center;
  font-size: 48px;
  line-height: 64px;
  margin-top: 0;
  margin-bottom: 3rem;
  transition: all 0.3s ease-in-out;
  background: linear-gradient(to right, #324d5c 0%, #46b29d 50%, #324d5c 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  &--small {
    font-size: 25px;

    @media (min-width: 672px) {
    }
  }

  @media (min-width: 672px) {
    font-size: 64px;
  }
}
</style>
