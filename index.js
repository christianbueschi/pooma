import VueRouter from 'vue-router';
//import Vue from 'vue';
import home from './app/Views/Home';
import dashboard from './app/Views/Dashboard';
import play from './app/Views/Play';
import share from './app/Views/Share';

const routes = [
	{ 
		path: '/',
		name: 'home',
		component: home
	},
	{ 
		path: '/dashboard',
		name: 'dashboard',
		component: dashboard 
	},
	{ 
		path: '/play',
		name: 'play',
		component: play 
	},
	{ 
		path: '/share',
		name: 'share',
		component: share 
	}
];

//Vue.use(VueRouter);

const router = new VueRouter({
	routes,
});

window.onload = () => {
	/* eslint-disable */
	new Vue({
		/* eslint-enable */
		router,
	}).$mount('#app');
};

if (module.hot) {
	module.hot.accept();
}


Vue.config.devtools = true;

