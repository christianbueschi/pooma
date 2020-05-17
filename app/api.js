import firebase from '@firebase/app';
import '@firebase/firestore';
import '@firebase/auth';
import store from './store';

const config = {
  apiKey: 'AIzaSyBLWgnEjIn6Rg6ZFEj4lP0bdYJsVs_VW24',
  authDomain: 'scrum-poker-98227.firebaseapp.com',
  databaseURL: 'https://scrum-poker-98227.firebaseio.com',
  projectId: 'scrum-poker-98227',
  storageBucket: 'scrum-poker-98227.appspot.com',
  messagingSenderId: '450465622076',
};

firebase.initializeApp(config);
const fs = firebase.firestore();
export default fs;

firebase
  .auth()
  .signInAnonymously()
  .catch((error) => console.log(errorCode, errorMessage));

const teamsRef = fs.collection('teams');

const api = {
  getTeamDoc(team) {
    if (!team) {
      console.error('getTeam(): team is not defined');
    }

    return teamsRef.doc(team);
  },

  getTeam(team) {
    if (!team) {
      console.error('getTeam(): team is not defined');
    }

    return teamsRef.doc(team).get();
  },

  setTeam(team) {
    if (!team) console.error('setTeam()', 'team is not defined');

    return teamsRef.doc(team).set({
      name: team,
    });
  },

  updateTeam(team, payload) {
    if (!team) console.error('updateTeam()', 'team is not defined');

    return teamsRef.doc(team).update(payload);
  },

  updateCardMode(team, payload) {
    if (!team) console.error('updateTeam()', 'team is not defined');

    return teamsRef.doc(team).update(payload);
  },

  getMembers(team) {
    const t = team || store.state.team;

    return teamsRef.doc(t).collection('users');
  },

  updateMember(member, payload) {
    if (!member) console.error('updateMember()', 'member is not defined');

    return this.getMembers()
      .doc(member)
      .update(payload);
  },

  removeMember(team, member) {
    if (!member) console.error('removeMember()', 'member is not defined');

    return this.getMembers(team)
      .doc(member)
      .delete();
  },
};

export { api };
