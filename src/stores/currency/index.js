import { defineStore } from 'pinia'
import { getList } from "@/api/currency";
import { getRandomNumber } from "@/utils/index.js";
import { showLoadingToast, closeToast } from 'vant';

export const useCurrencyStore = defineStore('CURRENCY', {
	state:() => ({
		list: []
	}),
	// computed
	getters: {

	},
	// methods
	actions: {
		fetchData() {
			showLoadingToast({
				message: '',
				forbidClick: true,
				duration: 0
			});
			getList().then(result => {
				this.list = result.data
        this.updata()
				closeToast()
      })
		},
		updata() {
			this.list.forEach(item => {
				item.timePrice = (Number(item.price) + getRandomNumber(-item.amplitude, item.amplitude)).toFixed(5)
			});
		}
	},
	persist: [
		{
			paths: [],
			storage: localStorage
		}, {
			paths: [],
			storage: sessionStorage
		}
	]
})