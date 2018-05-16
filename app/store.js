const store = {

	debug: true,
	state: {
		get user() { return window.localStorage.getItem('user') || ''},
		get team() { return window.localStorage.getItem('team') || ''},
		set user(name) { window.localStorage.setItem('user', name) },
		set team(name) { window.localStorage.setItem('team', name) }
	}
};

export default store;
