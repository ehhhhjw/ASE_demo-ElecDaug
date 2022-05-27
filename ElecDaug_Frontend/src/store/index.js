import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
        userId: 0,
        token: sessionStorage.getItem('token'),
        nickname: sessionStorage.getItem('nickname'),
        username: sessionStorage.getItem('username'),
        user_group_name: sessionStorage.getItem('user_group_name'),
    },
    mutations: {
        setUserId(state, value) {
            sessionStorage.setItem('userId', value),
            state.userId = value;
        },
        setToken(state, value) {
            sessionStorage.setItem('token', value),
            state.token = value;
        },
        setNickName(state, value) {
            sessionStorage.setItem('nickname', value),
            state.nickname = value;
        },
        setUser_group_name(state, value) {
            sessionStorage.setItem('user_group_name', value),
                
            state.user_group_name = value;
        },
        setUsername(state, value) {
            sessionStorage.setItem('username', value),
                
            state.username = value;
        }
    },
    getters: {
        getUserId(state) {
            return state.userId;
        },
        getToken(state) {
            return state.token;
        },
        getNickName(state) {
            return state.nickname;
        },
        getUser_group_name(state) {
            return state.user_group_name;
        },
        getUsername(state) {
            return state.username;
        },
    }
})
export default store
