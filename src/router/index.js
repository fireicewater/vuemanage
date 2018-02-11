import Vue from 'vue';
import Router from 'vue-router';
import auth from '../auth'
import Home from "../components/common/Home.vue"
import HomePage from "../components/page/HomePage.vue"
import BaseTable from "../components/page/BaseTable.vue"
import BaseForm from "../components/page/BaseForm.vue"
import Login from "../components/page/Login.vue"



Vue.use(Router);
const routes = [
    {
        path: '/',
        redirect: '/manager/login'
    },
    {
        path: '/manager/home',
        component: Home,
        children: [
            {
                path: '/',
                component: HomePage
            },
            auth.isadmin() && {
                path: '/manager/userstable',
                component: BaseTable
            },
            {
                path: '/manager/usersform',
                component: BaseForm
            }
        ]
    },
    {
        path: '/manager/login',
        component: Login
    }
]

function getroutes() {
    let home = routes[1];
    let homechildren = home.children;
    homechildren = homechildren.filter(router => router);
    home.children = homechildren;
    routes[1] = home;
    return routes;
}

export default new Router({
    mode: 'history',
    // routes: [
    //     {
    //         path: '/',
    //         redirect: '/manager/login'
    //     },
    //     {
    //         path: '/manager/home',
    //         component: resolve => require(['../components/common/Home.vue'], resolve),
    //         children: [
    //             {
    //                 path: '/',
    //                 component: resolve => require(['../components/page/HomePage.vue'], resolve)
    //             },
    //             auth.isadmin() && {
    //                 path: '/manager/basetable',
    //                 component: resolve => require(['../components/page/BaseTable.vue'], resolve)
    //             },
    //             {
    //                 path: '/manager/baseform',
    //                 component: resolve => require(['../components/page/BaseForm.vue'], resolve)
    //             }
    //         ]
    //     },
    //     {
    //         path: '/manager/login',
    //         component: resolve => require(['../components/page/Login.vue'], resolve)
    //     }
    // ]
    routes: getroutes()
})
