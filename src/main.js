import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './stores'
import { Toast, ConfigProvider,List } from 'vant'
// import permission from './permission'
import { loadAllPlugins } from '@/plugins'

import './styles/_index.scss'
import 'vant/es/toast/style'
import 'vant/es/dialog/style'

import VantHeader from './components/VantHeader.vue'

const app = createApp(App)

// 加载所有插件
loadAllPlugins(app)
// permission(pinia)

app.use(pinia)
app.use(router).use(List)
app.use(Toast)
app.use(ConfigProvider)
app.use(VantHeader)
setTimeout(() => {
  app.mount('#app')
}, 300)
