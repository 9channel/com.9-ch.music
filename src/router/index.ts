import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/view/HomeView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/view/AboutView.vue'),
    },
    {
      path: '/metronome',
      name: 'metronome',
      component: () => import('@/view/Metronome.vue'),
    },
  ],
});

export default router;
