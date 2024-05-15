/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/**/*.{vue,js,ts,jsx,tsx}'],
	darkMode: 'class',
	theme: {
		extend: {
			spacing(config) {  
				let result = { 0: '0' }  
				// 允许的数值大一些也无所谓，最后打包tailwindcss会摇树优化，未使用的样式并不会打包  
				for (let i = 1; i <= 750; i++  ) {  
						result[i] = `${i}px`  
				}  
				return result  
			},
			width() {
					let result = { 0: '0' }  
					for (let i = 1; i <= 750; i++  ) {  
							result[i] = `${i}px!important`  
					}  
					return result  
			}, 
			height() {
					let result = { 0: '0' }  
					for (let i = 1; i <= 750; i++  ) {  
							result[i] = `${i}px!important`  
					}  
					return result  
			}, 
		},
	},
	corePlugins: {
		preflight: false
	}
}
