<template>
  <div v-if="showInstallMessage" class="c-add-to-home">
    Install this webapp on your iPhone: tab on the icon below and then "Add to
    homescreen".
  </div>
</template>

<script>
export default {
  name: 'addToHomeScreen',
  props: [],
  data() {
    // Detects if device is on iOS
    const isIos = () => {
      const userAgent = window.navigator.userAgent.toLowerCase();
      return /iphone|ipad|ipod/.test(userAgent);
    };
    // Detects if device is in standalone mode
    const isInStandaloneMode = () =>
      'standalone' in window.navigator && window.navigator.standalone;

    return {
      showInstallMessage: isIos() && !isInStandaloneMode(),
    };
  },
};
</script>

<style lang="scss">
@import '../styles/variables';

.c-add-to-home {
  position: fixed;
  left: 0;
  bottom: 5px;
  background: $light;
  margin: 10px 20px;
  padding: 10px;
  color: white;
  box-shadow: 0px 0px 10px 1px rgba(51, 51, 51, 1);
  font-size: 13px;

  &:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 10px 10px 0 10px;
    border-color: $light transparent transparent transparent;
  }
}
</style>
