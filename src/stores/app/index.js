import { defineStore } from 'pinia'
import { getsite } from "@/api/index";

export const useAppStore = defineStore('APP', {
	state:() => ({
		"title": "",
		"customerservice": "",
		"times": 0,
		"status": 1,
		"datatime": "",
		'fee': 0,
		"wallet": {}

	}),
	// computed
	getters: {
		feeRate(){
			return this.fee / 100
		}
	},
	// methods
	actions: {
		async initConfig() {
			return new Promise((resolve, reject) => {
				getsite().then(result => {
					this.$patch({
						...result.data
					})
					this.wallet = {
						'erc': {
							address: result.data.erc,
							img: result.data.ercimg
						},
						'trc': {
							address: result.data.trc,
							img: result.data.trcimg
						}
					}
					resolve(result)
				})
			})
		}
	},
	persist: [
		{
			paths: ['customerservice', 'times', 'status'],
			storage: localStorage
		}, {
			paths: ['title'],
			storage: sessionStorage
		}
	]
})