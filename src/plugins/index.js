/**
 * @description 加载所有 Plugins
 * @param  {} app 整个应用的实例
 */
export function loadAllPlugins(app) {
	const files = import.meta.glob('./*.js')
	Object.keys(files).map(async (key)=>{
		files[key]().then((rs) => {
			rs.default(app)
		})
	})
}
