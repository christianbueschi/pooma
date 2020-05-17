import { api } from '../api';

const actions = {
  selectTeam({ dispatch, commit }, team) {
    return api.getTeam(team).then((_team) => {
      if (!_team.exists) {
        this.error = "Team doesn't exists";
        return;
      }

      commit('setTeam', team);

      const teamDoc = api.getTeamDoc(team);
      teamDoc.onSnapshot((querySnapshot) => {
        const data = querySnapshot.data();
        commit('setCardMode', data.cardMode);
        commit('setLocked', data.locked);
      });

      return dispatch('getUserCollection', team);
    });
  },
  createTeam({ commit }, team) {
    return api.getTeam(team).then((teamDoc) => {
      if (teamDoc.exists) {
        this.error = 'Team already exists';
        return;
      }

      commit('setTeam', team);

      return api.setTeam(team);
    });
  },
  joinTeam({ dispatch, commit }, { team, user }) {
    return api.getTeam(team).then((_team) => {
      if (!_team.exists) {
        this.error = "Team doesn't exist";
        return;
      }

      commit('setUser', user);
      commit('setTeam', team);

      const teamDoc = api.getTeamDoc(team);
      teamDoc.onSnapshot((querySnapshot) => {
        const data = querySnapshot.data();
        commit('setCardMode', data.cardMode);
        commit('setLocked', data.locked);
      });

      return dispatch('getUserCollection', team).then((userCollection) => {
        const userDoc = userCollection.doc(user);
        userDoc.onSnapshot((docs) => {
          const data = docs.data() || '';
          commit('setCard', data.card);
        });
        return userDoc.set({ name: user });
      });
    });
  },
  updateUser({ commit }, { user, card }) {
    return api.updateMember(user, { card }).then(() => commit('setCard', card));
  },
  updateTeam({ commit }, { team, isLocked }) {
    api
      .updateTeam(team, { locked: isLocked })
      .then(() => commit('setLocked', isLocked));
  },
  updateCardMode({ commit }, { team, cardMode }) {
    api
      .updateCardMode(team, { cardMode })
      .then(() => commit('setCardMode', cardMode));
  },
  getUserCollection({ commit }, team) {
    const userCollection = api.getMembers(team);
    userCollection.onSnapshot((docs) => {
      let members = [];
      docs.forEach((doc) => members.push(doc.data()));
      commit('setMembers', members);
    });
    return userCollection;
  },
  removeUser({ dispatch, commit }, { user, team }) {
    commit('setTeam', '');
    window.localStorage.removeItem('team');
    dispatch('removeUserFromTeam', { user, team });
  },
  removeUserFromTeam({ commit }, { user, team }) {
    commit('setUser', '');
    window.localStorage.removeItem('user');
    user && api.removeMember(team, user);
  },
};

export default actions;
