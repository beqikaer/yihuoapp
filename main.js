import Vue from 'vue'
import App from './App'



Vue.config.productionTip = false


// 封装跳转
import mixin from './common/mixin/mixin.js'
Vue.mixin(mixin)

// 工具方法 
import * as util from './common/js/util.js'
// 挂载到Vue原型上，在组件页面中，直接通过 this.$util.throttle
Vue.prototype.$util = util

//状态管理
import store from './store'
Vue.prototype.$store = store

App.mpType = 'app'

const app = new Vue({
	store,
	...App
})
app.$mount()
