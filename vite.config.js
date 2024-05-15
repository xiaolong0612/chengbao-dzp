import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from '@vant/auto-import-resolver';

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		assetsDir: 'index'
	},
  plugins: [
    vue(),
    Components({
      resolvers: [VantResolver()],
    }),
  ],
  resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url))
		}
	},
  server: {
		port: 5139,
		host: '0.0.0.0',
		// proxy: {// 跨域代理
		// 	'/index': {
		// 		target: 'https://usdtxya.com', // 后端提供的接口地址
		// 		changeOrigin: true // 开启跨域代理
		// 	}
		// }
	},
})
