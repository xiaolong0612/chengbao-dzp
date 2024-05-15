import axios from 'axios'
import { Dialog, showToast } from 'vant'
import { useUserStore } from '@/stores/user'

const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  timeout: 60000 // request timeout
})

// request interceptor
service.interceptors.request.use(
	config => {
    const user = useUserStore()
		if(user.token){
			config.headers['Authorization'] = user.token
		}
		return config
	},
	error => {
		// do something with request error
		console.log(error) // for debug
		return Promise.reject(error)
	}
)

service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code !== 200) {
      showToast(res.msg)
      if (res.code === 401) {
        const user = useUserStore()
        user.resetToken()
      }
      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      return res
    }
  },
  error => {
    return Promise.reject(error)
  }
)

export default service
