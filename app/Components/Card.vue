<template>

    <li class="a-card" v-bind:class="{'is-active': card === activeCard}">

        <div v-if="card !== undefined" class="a-card__container is-ready"
             v-bind:class="{'is-open' : isSet, 'is-locked': isLocked }"
             v-on:click="handleClick(card)">
            <div class="a-card__container__inner">
                <div class="a-card__front">
                    <span v-bind:class="{'small' : card.length > 3}">
                        {{card}}
                    </span>
                </div>
                <div class="a-card__back">
                    <span>Ready</span>
                </div>
            </div>
        </div>

        <header class="a-card__header" v-if="member">
            <span class="a-card__title">{{member.name}}</span><!--
         --><span class="a-card__remove" v-on:click="() => remove(member.name)"></span>
        </header>
        <div v-if="member" class="a-card__container"
             v-bind:class="{'is-ready': member.card || active, 'is-open' : isOpen, 'is-highest': member.card === highest, 'is-lowest': member.card === lowest }">

            <div class="a-card__container__inner">
                <div class="a-card__front">
                    <span v-if="!member.card">?</span>
                    <span v-if="member.card">Ready</span>
                </div>
                <div class="a-card__back">
                    {{member.card}}
                </div>
            </div>
        </div>

    </li>
</template>

<script>
	export default {
		name: "card",
		props: ['card', 'member', 'active', 'activeCard', 'isLocked', 'onClickCard'],
        data() {

			return {
				isSet: false,
            }
        },

        methods: {

	        handleClick(card) {
		        this.isSet = !this.isSet;
                this.onClickCard(card);
            }

        }
	}
</script>

<style lang="scss">

    @import '../styles/variables';

    .a-cards {
        margin: 10px;
        float: left;
        list-style: none;
        width: 120px;

        &__header {
            color: white;
            position: relative;
            margin: 0;
            padding: 1rem 0;

            &:hover .a-card__remove {
                display: inline-block;

                &:hover {

                    &:before,
                    &:after {
                        background-color: $red;
                    }
                }
            }
        }

        &__title {
            display: inline-block;
            width: calc(100% - 20px);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        &__remove {
            display: none;
            width: 20px;
            height: 18px;
            cursor: pointer;

            &:before,
            &:after {
                position: absolute;
                display: block;
                content: '';
                height: 15px;
                width: 2px;
                background-color: white;
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

            .is-active & {

                &.is-locked {
                    background-color: $red;
                    color: white;
                }
            }
        }

        &__container,
        &__front,
        &__back {
            width: 120px;
            height: 150px;
            transition: all 0.6s ease-in-out;
        }

        &__front,
        &__back {
            backface-visibility: hidden;
            position: absolute;
            top: 0;
            left: 0;
            display: flex;
            color: white;
            align-items: center;
            justify-content: center;
            font-size: 25px;
        }

        &__front {
            background: $blue;
            z-index: 2;
            /* for firefox 31 */
            transform: rotateY(0deg);

            .is-ready & {
                background: $blue-dark;
            }

            span.small {
                font-size: 1rem;
                line-height: 1rem;
            }
        }

        &__back {
            background: $blue;
            transform: rotateY(180deg);

            .is-lowest & {
                background-color: green;
            }

            .is-highest & {
                background-color: $red;
            }
        }

    }

</style>