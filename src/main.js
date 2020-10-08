import Vue from 'vue'
import App from './App.vue'
// import fontawesome from '@fortawesome/fontawesome-free'
//
// fontawesome.config = { autoReplaceSvg: false }

Vue.config.productionTip = false
Vue.use(require("moment"));

new Vue({
  render: h => h(App),
}).$mount('#app')
