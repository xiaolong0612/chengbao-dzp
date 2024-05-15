import { createRouter, createWebHashHistory } from 'vue-router'
import { i18n } from '@/lang'
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
	// {
	// 	path: '/login',
	// 	component: () => import('@/views/login/index.vue')
	// },
	// {
	// 	path: '/register',
	// 	component: () => import('@/views/login/register.vue')
	// },
	// {
	// 	path: '/forget',
	// 	component: () => import('@/views/login/forget.vue')
	// },
	// {
	// 	path: '/pay',
	// 	component: () => import('@/views/pay/index.vue')
	// },
	// {
	// 	path: '/user',
	// 	children: [
	// 		{
	// 			path: 'setting',
	// 			component: () => import('@/views/user/setting.vue'),
	// 			meta: {title: i18n.global.t('setting.title')}
	// 		}, {
	// 			path: 'safeCenter',
	// 			component: () => import('@/views/user/safeCenter.vue'),
	// 			meta: {title: i18n.global.t('setting.securityCenter')}
	// 		}, {
	// 			path: 'checkEmail',
	// 			component: () => import('@/views/user/checkEmail.vue'),
	// 			meta: {title: i18n.global.t('safeCenter.emailCheck')}
	// 		}, {
	// 			path: 'changePwd',
	// 			component: () => import('@/views/user/changePwd.vue'),
	// 			meta: {title: i18n.global.t('safeCenter.changePwd')}
	// 		}, {
	// 			path: 'changeEmail',
	// 			component: () => import('@/views/user/changeEmail.vue'),
	// 			meta: {title: i18n.global.t('safeCenter.changeEmail')}
	// 		}, {
	// 			path: 'aboutUs',
	// 			component: () => import('@/views/user/aboutUs.vue'),
	// 			meta: {title: i18n.global.t('setting.aboutUs')}
	// 		}, {
	// 			path: 'helpCenter',
	// 			component: () => import('@/views/user/helpCenter.vue'),
	// 			meta: {title: i18n.global.t('user.help')}
	// 		}, {
	// 			path: 'useVip',
	// 			component: () => import('@/views/user/useVip.vue'),
	// 			meta: {title: i18n.global.t('helpCenter.howToUseVip')}
	// 		}, {
	// 			path: 'accountSafe',
	// 			component: () => import('@/views/user/accountSafe.vue'),
	// 			meta: {title: i18n.global.t('helpCenter.accountSafe')}
	// 		}, {
	// 			path: 'buyCoin',
	// 			component: () => import('@/views/user/buyCoin.vue'),
	// 			meta: {title: i18n.global.t('user.buycoin')}
	// 		}
	// 	]
	// },
	// {
	// 	path: '/order',
	// 	children: [
	// 		{
	// 			path: 'recharge',
	// 			component: () => import('@/views/order/recharge.vue'),
	// 			meta: {title: i18n.global.t('order.recharge')}
	// 		}, {
	// 			path: 'rechargeRecord',
	// 			component: () => import('@/views/order/rechargeRecord.vue'),
	// 			meta: {title: i18n.global.t('order.recharge')}
	// 		}, {
	// 			path: 'withdraw',
	// 			component: () => import('@/views/order/withdraw.vue'),
	// 			meta: {title: i18n.global.t('order.withdraw')}
	// 		}, {
	// 			path: 'withdrawRecord',
	// 			component: () => import('@/views/order/withdrawRecord.vue'),
	// 			meta: {title: i18n.global.t('order.withdraw')}
	// 		}, {
	// 			path: 'transfer',
	// 			component: () => import('@/views/order/transfer.vue'),
	// 			meta: {title: i18n.global.t('order.transfer')}
	// 		}, {
	// 			path: 'transferRecord',
	// 			component: () => import('@/views/order/transferRecord.vue'),
	// 			meta: {title: i18n.global.t('order.transfer')}
	// 		}, {
	// 			path: 'upgrade',
	// 			component: () => import('@/views/order/upgrade.vue'),
	// 			meta: {title: i18n.global.t('order.upgrade')}
	// 		}, {
	// 			path: 'upgradeRecord',
	// 			component: () => import('@/views/order/upgradeRecord.vue'),
	// 			meta: {title: i18n.global.t('order.upgrade')}
	// 		}
	// 	]
	// },
]

const router = createRouter({
	history: createWebHashHistory(import.meta.env.BASE_URL),
	routes: constantRoutes
})

export default router
