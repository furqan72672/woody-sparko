import Vue from 'vue';
import VueRouter from 'vue-router';

import Dashboard from './components/Dashboard';
import SignInView from './views/auth/SignIn';
import NotFound from './views/404.vue';
import Home from './views/home.vue';

import {appointmentsRouter} from "@/views/appointments/router";
import {settingsRouter} from "@/views/settings/router";
import {timeSlotsRouter} from "@/views/time-slots/router";
import VerifyAccount from "@/views/auth/VerifyAccount";
import ResetPassword from "@/views/auth/ResetPassword";

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Dashboard,
        children: [
            {
                name: 'Index',
                path: '/',
                component: Home
            },
            ...appointmentsRouter,
            ...settingsRouter,
            ...timeSlotsRouter,
        ]
    },
    {
        name: 'SignIn',
        path: '/auth/sign-in',
        component: SignInView
    },
    {
        name: 'VerifyAccount',
        path: '/auth/verify-account/:hash/:id',
        component: VerifyAccount
    },
    {
        name: 'ResetPassword',
        path: '/auth/reset-password/:hash',
        component: ResetPassword
    },
    {
        name: 'NotFound',
        path: '**',
        component: NotFound
    }
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

// eslint-disable-next-line no-unused-vars
router.beforeEach((to, __, next) => {
    if (!localStorage.getItem('auth_token') && !to.path.includes('/auth/verify-account/') && !to.path.includes('/auth/reset-password/')) {
        if (to.path !== '/auth/sign-in') {
            next('/auth/sign-in');
        }
    }
    next();
});

export default router;
