import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'home',
    redirect: '/outline',
  },
  {
    path: '/outline',
    name: 'outline',
    component: () => import('../views/OutlineView.vue'),
    meta: {
      title: 'Outline',
      icon: 'list-tree',
    },
  },
  {
    path: '/todo',
    name: 'todo',
    component: () => import('../views/TodoView.vue'),
    meta: {
      title: 'To-Do',
      icon: 'check-square',
    },
  },
  {
    path: '/inbox',
    name: 'inbox',
    component: () => import('../views/InboxView.vue'),
    meta: {
      title: 'Inbox',
      icon: 'inbox',
    },
  },
  {
    path: '/active',
    name: 'active',
    component: () => import('../views/ActiveActionsView.vue'),
    meta: {
      title: 'Active Actions',
      icon: 'zap',
    },
  },
  {
    path: '/goals',
    name: 'goals',
    component: () => import('../views/GoalsView.vue'),
    meta: {
      title: 'Goals',
      icon: 'target',
    },
  },
  {
    path: '/review',
    name: 'review',
    component: () => import('../views/ReviewView.vue'),
    meta: {
      title: 'Review',
      icon: 'eye',
    },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Update document title on route change
router.beforeEach((to, from, next) => {
  const appName = import.meta.env.VITE_APP_NAME || 'MyLifeOrganized Clone';
  document.title = to.meta.title ? `${to.meta.title} - ${appName}` : appName;
  next();
});

export default router;
