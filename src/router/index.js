import { createRouter, createWebHistory  } from 'vue-router';

const routes = [
    {
        path: '/',
        component: () => import('@/views/ViewHome.vue')
    },
    {
        path: '/search',
        component: () => import('@/views/ViewSearch.vue')
    },
    {
        path: '/feedback',
        component: () => import('@/views/ViewFeedback.vue')
    }
];

const router = createRouter({
    history: createWebHistory (),
    routes
});

export default router;
