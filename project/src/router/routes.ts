import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/home',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '/home', component: () => import('pages/IndexPage.vue') }],
  },

  {
    path: '/',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      {
        path: '',
        name: 'loginPage',
        component: () => import('pages/LoginPage.vue')
      },

      {
        path: '/register',
        name: 'registerPage',
        component: () => import('pages/RegisterPage.vue')
      }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
