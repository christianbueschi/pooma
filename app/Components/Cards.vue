<template>
    <section>
        <ul class="o-cardlist">
            <li class="o-cardlist__item"
                v-for="(card, index) in cards"
                v-bind:key="index"
                v-on:click="onClickCard(card)">
                <span v-bind:class="{'small' : card.length > 3}">
                    {{card}}
                </span>
            </li>
            <li class="o-cardlist__ready" v-bind:class="{'is-locked': isLocked }" v-if="activeCard" v-on:click="onClickReady()">
                <p class="o-cardlist__ready__inner">Ready</p>
            </li>
        </ul>
    </section>
</template>

<script>
	export default {
		name: "cards",
		props: ['handleClick', 'isLocked', 'activeCard'],
		data() {

			return {
				cards: [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, "I don't know", "Impossible, we don't do that!", "I need a break"],
			}
		},
		methods: {

			onClickCard(card) {
                card = card === 0 ? '0' : card;
				this.activeCard = card;
				this.handleClick(card);
			},

            onClickReady() {

                if(this.isLocked)
					return;

                this.activeCard = '';
                this.handleClick(this.activeCard);
            }
		},

        watch: {            
            isLocked: function(val) {
                if(val) {
				    
                } else {
					
                }

           }
        }
	}
</script>

<style lang="scss">

    @import '../styles/variables';

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
            line-height: 2rem;
            background: $light;
            cursor: pointer;
            transition: transform 0.25s ease-in-out;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;

            &:before {
                content: '';
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
                font-size: 1rem;
                line-height: 1rem;
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