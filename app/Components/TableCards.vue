<template>
   
    <ul class="c-tablecards" v-if="members.length > 0">
        <li class="c-tablecards__card" v-bind:key="i" v-for="(member, i) in members">
            <h4 class="c-tablecards__card__name">
                <span class="c-tablecards__card__name__inner">{{member.name}}</span><!--
                --><span class="remove" v-on:click="() => remove(member.name)"></span>
            </h4>
            <div class="c-tablecards__card__container"
                    v-bind:class="{'is-ready': member.card, 'is-open' : isOpen, 'is-highest': member.card === highest, 'is-lowest': member.card === lowest }">
                <div class="c-tablecards__card__container__inner">
                        <div class="c-tablecards__card__front">
                            <span v-if="!member.card">?</span>
                            <span v-if="member.card">Ready</span>
                        </div>
                        <div class="c-tablecards__card__back" v-bind:class="{'small' : member.card && member.card.length > 3}">
                            {{member.card}}
                        </div>
                    </div>
                </div>
            </li>
        </ul>

</template>

<script>
export default {
  name: "tableCards",
  props: ["members", "isOpen", "highest", "lowest", "remove"]
};
</script>

<style lang="scss">
@import "../styles/variables";

.c-tablecards {
  display: block;
  overflow: hidden;
  padding-left: 0;
  padding-bottom: 5rem;
  margin-bottom: 2rem;
  text-align: center;

  &__card {
    margin: 10px;
    display: inline-block;
    list-style: none;
    width: 120px;

    &__name {
      color: #333;
      position: relative;
      margin: 0;
      padding: 1rem 0 0.5rem;

      &:hover {
        .remove {
          display: inline-block;

          &:hover {
            &:before,
            &:after {
              background-color: $red;
            }
          }
        }
      }

      &__inner {
        display: inline-block;
        width: calc(100% - 20px);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .remove {
        display: none;
        width: 20px;
        height: 18px;
        cursor: pointer;

        &:before,
        &:after {
          position: absolute;
          display: block;
          content: "";
          height: 15px;
          width: 2px;
          background-color: #333;
          top: 1rem;
          right: 5px;
        }

        &:before {
          transform: rotate(45deg);
        }

        &:after {
          transform: rotate(-45deg);
        }
      }
    }

    &__container {
      perspective: 1000px;

      &__inner {
        transition: all 0.6s ease-in-out;
        transform-style: preserve-3d;
        position: relative;

        .is-open & {
          transform: rotateY(180deg);
        }
      }
    }

    &__container,
    &__front,
    &__back {
      width: 120px;
      height: 150px;
      border-radius: 8px;
    }

    &__front,
    &__back {
      padding: 1rem;
      backface-visibility: hidden;
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      color: white;
      align-items: center;
      justify-content: center;
      font-size: 25px;
      box-shadow: 0px 5px 20px -5px rgb(0, 0, 0);
    }

    &__front {
      background: #46b29d;
      z-index: 2;
      /* for firefox 31 */
      transform: rotateY(0deg);

      .is-ready & {
        background: #324D5C;
      }
    }

    &__back {
      background: #de5b49;
      transform: rotateY(180deg);

      .is-open & {
        background-color: $dark;
      }

      .is-lowest & {
        background-color: $light;
      }

      .is-highest & {
        background-color: $red;
      }

      &.small {
        font-size: 16px;
      }
    }
  }
}
</style>
