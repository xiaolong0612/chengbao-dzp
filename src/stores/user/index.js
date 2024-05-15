import { defineStore } from 'pinia'
// import { usePermissionStore } from '../permission'
// import { login, logout } from '@/api/user'
// import { localCache } from '@/utils'

export const useUserStore = defineStore('USER', {
	state:() => ({
		token: ''
	}),
	// computed
	getters: {

	},
	// methods
	actions: {
		login(userInfo) {
			return new Promise((resolve, reject) => {
				login(userInfo).then(result => {
					if (result.code === 200) {
						const { data } = result
						this.info = data
						resolve(result)
					} else {
						reject()
					}
				}).catch(err => {
					reject(err)
				})
			})
		},
		logout() {
			return new Promise((resolve, reject) => {
				logout({token: this.token}).then(result => {
					if (result.code === 200) {
						this.resetToken()
						resolve()
					} else {
						reject()
					}
				})
			})
		},
		resetToken() {
			useUserStore().$reset()
		}
	},
	persist: true
})