import Vue from 'vue';
//import App from './App.vue';
import VueRouter from "vue-router";//路由
import Vuex from 'vuex'//状态管理
import routes from './router/router.js'//路由，router.js为路由配置文件
import axios from 'axios';//http请求
import Vuelidate from 'vuelidate';//表单验证

import global from './config/global'
Vue.prototype.global = global;

//开户debug模式
Vue.config.debug = true;
Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(Vuelidate);

/*
http请求配置，请求json数据，返回json数据
*/
import ajaxConfig from './config/ajaxConfig.js';
var ajax = axios.create();
ajax.defaults.baseURL = ajaxConfig.baseUrl;
ajax.defaults.headers = ajaxConfig.headers;
ajax.defaults.withCredentials = true;
ajax.defaults.responseType = ajaxConfig.responseType
ajax.defaults.transformRequest = ajaxConfig.transformRequest;
ajax.interceptors.response.use(ajaxConfig.transformResponse)//转换response数据格式
Vue.prototype.$http = ajax;

//http请求配置
var axs = axios.create();
axs.defaults.baseURL = ajaxConfig.baseUrl;
axs.defaults.headers = ajaxConfig.headers;
axs.defaults.withCredentials = true;
axs.defaults.responseType = ajaxConfig.responseType
//axs.defaults.transformRequest = ajaxConfig.transformRequest;
axs.interceptors.response.use(ajaxConfig.transformResponse)//转换response数据格式
Vue.prototype.$axios = axs;

//注册全局组件dialog
import dialog from './component/common/dialog.vue'
Vue.component('vdialog',dialog)
//注册全局组件 alert
import alert from './component/common/alert.vue'
Vue.component('alert',alert)




//定义路由
const router = new VueRouter({
    routes,
    mode:'history'
})
import vuexStore  from './store/store.js'
import login from  './page/login/login.vue'//登录
router.beforeEach((to,from,next) => {
    if(to.matched.some( m => m.meta.auth)){
        // 对路由进行验证
        if(vuexStore.getters.authorizd) { // 已经登陆
            next()
        }else{
            // 未登录,跳转到登陆页面，并且带上将要去的地址，方便登陆后跳转。
            next({path:'/login'})
        }
    }else{
        next()
    }
})

//import datetime from './assets/vender/bootstrap-datepicker';
//Vue.use(datetime)
/*
const app = new Vue({
    router:router,
    render:h => h(App)
}).$mount('#app');
*/
/*
new Vue({
 router,
  el: '#app',
  render: h => h(App)
})
*/
var  vm = new Vue({
    router,
    el:'#app',
    store:vuexStore
}).$mount('#app')
