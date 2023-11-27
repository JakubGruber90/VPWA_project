import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/channels',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '/channels', name: 'homePage', component: () => import('pages/IndexPage.vue'), meta: {requiresAuth: true} },
      { path: '/channels/:id', name: 'channelPage', component: () => import('pages/IndexPage.vue'),  meta: { requiresMembership: true }}
    ],
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
