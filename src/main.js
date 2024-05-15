import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './stores'
import { Toast, ConfigProvider } from 'vant'
// import permission from './permission'
import { loadAllPlugins } from '@/plugins'

import './styles/_index.scss'
import 'vant/es/toast/style'
import 'vant/es/dialog/style'

import VantHeader from './components/VantHeader.vue'

import { i18n, vantLocales } from './lang'
// 对vant组件进行初始化语言设置
vantLocales(i18n.global.locale.value)

const app = createApp(App)

// 加载所有插件
loadAllPlugins(app)
// permission(pinia)

app.use(pinia)
app.use(router)
app.use(Toast)
app.use(i18n)
app.use(ConfigProvider)
app.use(VantHeader)
setTimeout(() => {
  app.mount('#app')
}, 300)
