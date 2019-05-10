<template>
    <div>

        <Header></Header>

        <TableCards v-bind="{members, isOpen, highest, lowest, remove}"></TableCards>

        <Sidebar v-bind="{sharedState}"></Sidebar>
        
        <div v-if="members.length !== 0">
            <button class="a-btn a-btn--center" v-bind:class="{'a-btn--active': isOpen}" v-on:click="handleResolve">
                {{ isOpen ? 'Clear' : 'Resolve'}}
            </button>
        </div>

        <!--<pie-chart v-if="isOpen" :data="{pieData}" :options="{pieOptions}" class="chart"/>-->

		<div v-if="!sharedState.team" class="a-not-set">
			<p>You have not yet created or selected a team.</p>
			<router-link class="a-btn" :to="{ name: 'home', params: {tab: 'create' } }">
				Create Team
			</router-link>
		</div>
        <p class="a-not-set" v-else-if="members.length === 0">No members here at the moment.</p>
                
    </div>
</template>

<script>
	import PieChart from '../PieChart';
	import firestoreDb, {api} from '../firestore';
    import store from '../store';
    import TableCards from '../Components/TableCards'
    import Sidebar from '../Components/Sidebar'
    import Header from '../Components/Header'

	const teamsRef = firestoreDb.collection('teams');

	export default {
		name: 'dashboard',
		components: {
			PieChart, Sidebar, TableCards, Header
        },
		data() {

			if (store.state.team) {
				this.onChooseTeam();
			}

			return {
				team: '',
				members: [],
				error: '',
				isOpen: false,
				sharedState: store.state,
                lowest: '',
                highest: '',
                pieData: '',
                pieOptions: {
	                legend: {
		                labels: {
			                fontColor: 'white'
		                }
	                }
                },
			};
		},
		methods: {
			
			onChooseTeam() {

				const {team} = store.state;

				api.getTeam(team).then((doc) => {
					if (!doc.exists) {
						this.error = "Team doesn't exists";
					} else {
						api.getMembers(team).onSnapshot((docs) => {
							this.members = [];
							docs.forEach((doc) => {
								this.members.push(doc.data());
							})
						})
					}
				}).catch(err => console.error('onChooseTeam() => getTeam()', err));
			},

			addToStats(stats, card) {
				let alreadySet = false;

				stats.forEach((item) => {
					if(item.label === card) {
                        item.count++;
						alreadySet = true;
                    }
                });

				if(!alreadySet) {
					stats.push( { label: card, count: 1} );
                }
            },

            setStats() {
	            let lowest = '';
	            let highest = '';
	            let stats = [];

	            this.members.forEach((member) => {

		            if (member && member.card === '')
			            return;

		            this.addToStats(stats, member.card);

		            if (!lowest && !highest) {
			            lowest = member.card;
			            highest = member.card;
		            } else if(member.card < lowest) {
			            lowest = member.card;
		            } else if(member.card > highest) {
			            highest = member.card;
		            }

	            });

	            this.lowest = lowest;
	            this.highest = highest;

	            return stats;
            },

            handleResolve() {
                this.isOpen ? this.clear() : this.resolve();
            },

			resolve() {
                this.isOpen = true;
				const stats = this.setStats();

				api.updateTeam({locked: true});

				const getColor = (number) => {
					if(number === this.highest)
						return 'rgba(222,91,73,1)';
					else if(number === this.lowest)
						return 'rgba(70,178,157,1)';
					else
						return 'rgba(7,134,216,1)';
				};

				this.pieData = {
					labels: stats.map(item => item.label),
                    datasets: [
					    {
						    data: stats.map(item => item.count),
                            backgroundColor: stats.map(item => getColor(item.label)),
						    options: {
							    legend: {
								    labels: {
									    // This more specific font property overrides the global property
									    fontColor: 'white'
								    }
							    }
						    }
					    }
				    ]
				}

			},

			clear() {

				this.members.forEach((member) => {
					api.updateTeam({locked: false});				
					api.updateMember(member.name, {card: ''});
				});

                this.isOpen = false;
			},

            remove(member) {
				api.removeMember(member);
            }

		},
		mounted() {
		},
	};
</script>

<style lang="scss">

    @import '../styles/variables';

    .title {
        text-align: left;
    }

    .chart {
        float: left;
        width: 25%;
        margin-top: 65px;
    }

</style>
