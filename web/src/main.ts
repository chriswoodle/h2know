localStorage.debug='app:*';
import Vue from 'vue'
import App from './App.vue'

// @ts-ignore
import Chart from 'vue2-frappe';

Vue.use(Chart)

import './styles/reset.scss';
import './styles/main.scss';

import router from './router'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
