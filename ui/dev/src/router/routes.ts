import { RouteRecordRaw } from 'vue-router';
import pages from './pages';

const children = pages.map((page) => ({
  path: page.path,
  component: () => import(/* @vite-ignore */ page.file + '.vue'),
}));

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/IndexPage.vue') }].concat(children),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
