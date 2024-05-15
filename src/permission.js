import router from './router'
import getPageTitle from '@/utils/get-page-title'
import { start, close } from '@/utils/nporgress' // 导入进度条
import { localCache } from "@/utils";
import { useAppStore } from "@/stores/app";

// no redirect whitelist
const whiteList = ['/login', '/register', '/forget', '/home', '/market'] // no redirect whitelist

// fix stores 多处导入导致缓存无效
export default function permission(pinia) {
	router.beforeEach(async(to, _, next) => {
    start()
    // set page title
		document.title = getPageTitle(to.meta.title)

    const app = useAppStore(pinia)
    // if(app.title == ''){
      await app.initConfig()
    // }
    // determine whether the user has logged in
    let isLogin = false
    try {
      isLogin = localCache.getItemCache('USER', 'info').id
    } catch (error) {
      
    }
    if (isLogin) {
      if (to.path === '/login') {
        // if is logged in, redirect to the home page
        next({ path: '/' })
      } else {
        next()
      }
    } else {
      /* has no token */
      if (whiteList.indexOf(to.path) !== -1) {
        next()
      } else {
        // other pages that do not have permission to access are redirected to the login page.
        next('/login')
      }
    }
    next()
  })

  router.afterEach(() => {
		// finish progress bar
		close()
	})
}
