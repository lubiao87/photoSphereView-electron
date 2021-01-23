import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from '@/store/index'
import models from './db/models'

//公共css
// import './assets/css/base.css';

// 引入element
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

import Avue from '@smallwei/avue';
import '@smallwei/avue/lib/index.css';
Vue.use(Avue);
Vue.prototype.$models = models

import 'lib-flexible'


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
