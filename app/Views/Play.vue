<template>
    <div>
		
		<Header/>

        <Cards v-if="isUserSet" v-bind="{handleClick, isLocked, activeCard}"/>

		<Sidebar v-bind="{sharedState}"/>
		<div v-if="!sharedState.user" class="a-not-set">
			<p>You have not yet joined a team.</p>
			<router-link class="a-btn" :to="{ name: 'home', params: {tab: 'join' } }">
				Join Team
			</router-link>
		</div>

    </div>
</template>

<script>
	import fs, {api} from '../firestore';
	import store from '../store';
	import Cards from '../Components/Cards';
	import Sidebar from '../Components/Sidebar';
	import Header from '../Components/Header';

	const teamsRef = fs.collection('teams');

	export default {
		name: 'play',
		components: {Cards, Sidebar, Header},
		data() {

			teamsRef.onSnapshot((querySnapshot) => {
				this.teams = [];
				querySnapshot.forEach((doc) => {
					const team = doc.data();
					this.teams.push(team);

					if (this.sharedState.team === team.name) {
						this.isLocked = team.locked;

						if (!team.locked) {
							this.activeCard = '';
						}
					}
				})
			});

			return {
				activeCard: '',
				teams: [],
				members: [],
				user: '',
				error: '',
				sharedState: store.state,
				isCreate: false,
				isSelect: false,
				isJoin: false,
				isTeamSet: !!store.state.team,
				isUserSet: !!store.state.user,
				isLocked: false
			};
		},
		methods: {

			handleClick(card) {

				if (this.isLocked) {
					return;
				}
				
				this.activeCard = card;
				api.updateMember(this.sharedState.user, {card: card});
			}
		}
	};
</script>