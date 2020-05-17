import Vuex from 'vuex';
import mutations from './mutations';
import actions from './actions';

Vue.use(Vuex);
Vue.config.devtools = true;

const store = new Vuex.Store({
  state: {
    user: '',
    team: '',
    card: '',
    cardMode: '',
    locked: '',
    members: [],
  },
  mutations,
  actions,
});

const initiallyLoadUser = () => {
  const localUser = window.localStorage.getItem('user');
  const localTeam = window.localStorage.getItem('team');

  if (localUser && localTeam) {
    store.dispatch('joinTeam', { team: localTeam, user: localUser });
  } else if (localTeam) {
    store.dispatch('selectTeam', localTeam);
  }
};

initiallyLoadUser();

export default store;
