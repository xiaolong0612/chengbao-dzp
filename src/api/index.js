import request from '@/utils/request'

export function getPrizeList() {
	return request({
		url: '/app/prize/getPrizeList',
		method: 'get'
	})
}

export function getGift() {
	return request({
		url: '/app/prize/lottery',
		method: 'get'
	})
}