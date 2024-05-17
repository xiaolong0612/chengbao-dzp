import { createRouter, createWebHashHistory } from 'vue-router'
export const constantRoutes = [
	{
		path: '/redirect/:path(.*)',
		component: () => import('@/views/redirect/index.vue')
	},
	{
		path: '/',
		component: () => import('@/views/tabs/index.vue'),
	},
	{
		path: '/order',
		component: () => import('@/views/order/index.vue'),
	},
]

const router = createRouter({
	history: createWebHashHistory(import.meta.env.BASE_URL),
	routes: constantRoutes
})

export default router
