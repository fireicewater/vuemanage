import Vue from 'vue';
import App from './App';
import router from './router';
import axios from 'axios';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css';    // 默认主题
import resource from "vue-resource"
// import '../static/css/theme-green/index.css';       // 浅绿色主题
import "babel-polyfill";
import auth from "./auth"

Vue.use(ElementUI);
Vue.use(resource);
Vue.prototype.$axios = axios;
// Vue.http.options.root = 'http://localhost:9090';
const LOGIN_PATH = '/manager/login';

function authInterceptor(to, from, next) {
    auth.checkAuth();
    if (auth.authenticated) {
        switch (to.path) {
            case LOGIN_PATH:
                next('/manager/home');
                return;
            default:
                next()
        }
    } else {
        switch (to.path) {
            case LOGIN_PATH:
                next();
                return;
            default:
                next(LOGIN_PATH)
        }
    }
}

router.beforeEach(authInterceptor);
new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
