import Vue from 'vue';
import App from './App.vue';
import router from './router';
import ElementUI from 'element-ui';
import VueI18n from 'vue-i18n';
import { messages } from './components/common/i18n';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import './assets/css/theme-green/index.css'; // 浅绿色主题
import './assets/css/icon.css';
import './components/common/directives';
import 'babel-polyfill';
import * as echarts from 'echarts'
import 'echarts-gl'
import store from './store'
import qs from 'qs'
import axios from 'axios'
import "./assets/icon/iconfont.css";
// import 'lib-flexible'

// axios.defaults.baseURL = '/proxy';

// axios.defaults.baseURL = '/proxy';
axios.defaults.baseURL = 'http://129.211.89.155:8050/';
// axios.defaults.baseURL = 'http://127.0.0.1:8001/api/';
// axios.defaults.baseURL = 'http://129.211.89.155:9000/api/';

// Vue.prototype.$axios = axios
Vue.prototype.$http = axios
Vue.prototype.$qs = qs
Vue.prototype.$echarts = echarts
Vue.config.productionTip = false;
// axios.interceptors.request.use(config => {
//     config.withCredentials = false;
//     // header("Access-Control-Allow-Origin: *");
//     // config.headers.Authorization = store.state.token;
//     return config;
// })

// axios配置
axios.defaults.withCredentials = false; // 携带cookie
// axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'; // 判断是否为ajax请求



// axios.interceptors.response.use(config => {
//     return config;
// })
Vue.use(VueI18n);
Vue.use(ElementUI, {
    size: 'small'
});
Vue.filter('dateFormat', function (originVal) {
    if (originVal) {
        var res = originVal + '';
        res = res.split('.')[0].replace('T', ' ');
        return res
    }
})
const i18n = new VueI18n({
    locale: 'zh',
    messages
});
// router.beforeEach((to, from, next) => {
//     document.title = `${to.meta.title} | LidarPlatform`;
//     const role = store.state.token;
//     if (!role && to.path !== '/login') {
//         next('/login');
//     } else if (to.meta.permission) {
//         role === 'admin' ? next() : next('/403');
//     } else {
//         if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
//             Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
//                 confirmButtonText: '确定'
//             });
//         } else {
//             next();
//         }
//     }
// });
new Vue({
    router,
    i18n,
    store,
    render: h => h(App)
}).$mount('#app');
