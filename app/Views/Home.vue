<template>
    <div>

		<Header/>

        <section class="v-home__copy" v-if="!isTeamSet && !isUserSet">
            <p><span>Scrum Planning Poker at its finest!</span> <span>Virtually estimate your team stories with ease 🎉</span></p>
        </section>

        <Tabs v-bind="{sharedState}"/>

		<Sidebar v-bind="{sharedState}"/>

		<AddToHomeScreen/>

    </div>
</template>

<script>
	import store from '../store';
	import Tabs from '../Components/Tabs';
	import Sidebar from '../Components/Sidebar';
	import Header from '../Components/Header';
	import AddToHomeScreen from '../Components/AddToHomeScreen';

	export default {
		name: 'app',
		components: {Tabs, Sidebar, Header, AddToHomeScreen},
		data() {

			return {
				sharedState: store.state
			};
		}
	};
</script>

<style lang="scss">

	@import '../styles/base';

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
