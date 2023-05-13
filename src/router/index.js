//引入管理首页面页面
import HomeView from '../views/HomeView.vue'
//引入登录页面
import Login from '@/views/Login.vue'
//引入充电桩管理页面
import Chargers from "@/views/Chargers.vue";
//引入用户管理页面
import ManageUsers from "@/views/ManageUsers.vue";
//引入用户订单页面
import ManageOrders from "@/views/ManageOrders.vue";


import {createRouter, createWebHistory} from "vue-router";

const routes = [
    {
        path: '/',
        name: '登录',
        hidden: true,
        component: Login,
    }, {
        path: '/home',
        name: '站点管理[主页面]',
        component: HomeView,
        hidden: true,
    }, {
        path: '/chargers',
        name: '充电桩管理',
        component: Chargers,
        hidden: true,
    }, {
        path: '/users',
        name: '用户管理',
        component: ManageUsers,
        hidden: true,
    }, {
        path: '/orders',
        name: '订单管理',
        component: ManageOrders,
        hidden: true,
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
