<template>
    <aside class="c-sidebar">

        <button class="c-sidebar__toggle" v-on:click="onToggleNav()" v-bind:class="{'c-sidebar__toggle--close': isActive}">
            <span></span>
            <span></span>
        </button>

        <section class="c-sidebar__inner" v-bind:class="{'is-open':isActive}">
            <header class="c-sidebar__header">
                <section class="c-sidebar__section">
                    <h6 class="c-sidebar__label">Team</h6>
                    <h2 class="c-sidebar__title" v-bind:class="{'not-set' : !sharedState.team}">
                        {{sharedState.team ? sharedState.team : 'No team set'}}
                    </h2>
                </section>
                <section class="c-sidebar__section">
                    <h6 class="c-sidebar__label">User</h6>
                    <h2 class="c-sidebar__title" v-bind:class="{'not-set' : !sharedState.user}">
                        {{sharedState.user ? sharedState.user : 'No user set'}}
                    </h2>
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
                <div v-if="sharedState.user || sharedState.team" class="c-sidebar__nav__link c-sidebar__nav__link--signout" v-on:click="onResetUser">
                    <i class="fas fa-sign-out-alt"></i>
                    Sign Out
                </div>
            </nav>

        </section>
    </aside>
</template>

<script>

	export default {
        name: "sidebar",
        props: ["sharedState"],
		data() {

			return {
                isActive: false
            }
		},
		methods: {

			onToggleNav() {
                this.isActive = !this.isActive;
            },

            onResetUser() {
                window.localStorage.removeItem('user');
                window.localStorage.removeItem('team');
				this.sharedState.user = '';
				this.sharedState.team = '';
                this.$router.push({path: '/'});
            }
		}
	}
</script>
    
<style lang="scss">

@import '../styles/variables';

.c-sidebar {

    &__toggle {
        position: absolute;
        right: 0;
        top: 40px;
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
            transition: all .25s ease-in-out;

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
          color: #46B29D;
      }
    }
  }
}
</style>