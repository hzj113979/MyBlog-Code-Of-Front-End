import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'
import axios from 'axios'
import 'font-awesome/css/font-awesome.min.css'
import './utils/filter_utils.js'
// 引入v-md-editor 组件及样式
import './assets/md/code.js';

Vue.use(ElementUI)
Vue.use(Vuex)
Vue.prototype.$http = axios
Vue.config.productionTip = false
window.bus = new Vue();
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
