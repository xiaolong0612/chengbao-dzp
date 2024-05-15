import request from '@/utils/request'

export function getPrizeList() {
	return request({
		url: '/app/prize/getPrizeList',
		method: 'get'
	})
}

export function getGamesInfo() {
	return request({
		url: '/app/prize/getPrizeDesc',
		method: 'get'
	})
}

export function getGameCost() {
	return request({
		url: '/app/prize/getPrizeCost',
		method: 'get'
	})
}
export function getRewardRecord(data) {
	return request({
		url: '/app/lotteryRecordLog/myLatestLotteryRecord',
		method: 'post',
		data:data
	})
}
export function exchangeReward(data) {
	return request({
		url: '/app/prize/exchangePrize',
		method: 'post',
		data:data
	})
}
export function remarkReward(data) {
	return request({
		url: '/app/prize/updatePrizeRecord',
		method: 'post',
		data:data
	})
}
export function getMyOwnRewardRecord(data) {
	return request({
		url: '/app/lotteryRecordLog/myWinningLotteryRecord',
		method: 'post',
		data:data
	})
}
export function getGift() {
	return request({
		url: '/app/prize/lottery',
		method: 'get'
	})
}