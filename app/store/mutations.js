const mutations = {
  setUser(state, name) {
    state.user = name;
    window.localStorage.setItem('user', name);
  },
  setTeam(state, name) {
    state.team = name;
    window.localStorage.setItem('team', name);
  },
  setCard(state, number) {
    state.card = number;
  },
  setCardMode(state, cardMode) {
    state.cardMode = cardMode;
  },
  setLocked(state, isLocked) {
    state.locked = isLocked;
  },
  setMembers(state, members) {
    state.members = members;
  },
};

export default mutations;
