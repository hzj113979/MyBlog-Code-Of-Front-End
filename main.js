import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import 'font-awesome/css/font-awesome.min.css'
import './utils/filter_utils.js'
// import './assets/GlobalCSS/global.css'

// axios.defaults.withCredentials = true;
Vue.prototype.$http = axios
Vue.use(ElementUI)

Vue.config.productionTip = false
window.bus = new Vue();
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
