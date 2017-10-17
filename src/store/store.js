// store.js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
let modules = {
    //state:{ authorizd:false },
    state:{ authorizd:window.localStorage.isLogin? true:false },
    getters:{
        authorizd: state => state.authorizd
    },
    actions: {

        /*
        login({commit},payload){
            // ajax 登陆流程，
            commit("login", 登陆信息)
        }
        */
    },
    mutations:{
        login(state){
            state.authorizd = true // 假定登陆成功后，设置 state.
        },
        logout(state){
            state.authorizd = false;
        }
    }
}
export default new Vuex.Store(
    modules
)