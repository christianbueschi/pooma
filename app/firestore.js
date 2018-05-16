import firebase from 'firebase';
import store from './store';
require('firebase/firestore');

const config = {
	apiKey: '',
	authDomain: '',
	databaseURL: '',
	projectId: '',
	storageBucket: '',
	messagingSenderId: ''
};

firebase.initializeApp(config);
const fs = firebase.firestore();
export default fs;


firebase.auth().signInAnonymously().catch(error => console.log(errorCode, errorMessage));

firebase.auth().onAuthStateChanged((user) => {
	if (user) {
		console.log(user);
	} else {
		console.log('couldtn log in user');
	}
});

const teamsRef = fs.collection('teams');

const api = {

	getTeam(team) {
		const t = team || store.state.team;

		return teamsRef.doc(t).get();
	},

	setTeam(team) {

		if(!team)
			console.error('setTeam()', 'team is not defined')

		return teamsRef.doc(team).set({
			name: team
		});
	},
	
	updateTeam(payload) {

		if(!store.state.team)
			console.error('updateTeam()', 'team is not defined')

		teamsRef.doc(store.state.team).update(payload);
	},

	getMembers(team) {
		const t = team || store.state.team;

		return teamsRef.doc(t).collection('users');
	},

	updateMember(member, payload) {

		if(!member)
			console.error('updateMember()', 'member is not defined')

		return this.getMembers().doc(member).update(payload);
	},

	removeMember(member) {

		if(!member)
			console.error('removeMember()', 'member is not defined')

		return this.getMembers().doc(member).delete();
	}

};

export { api };
