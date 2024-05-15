import { parseTime, formatImgPath, getAssetsFile } from '@/utils/index'

const fn = {
	parseTime,
	formatImgPath,
	getAssetsFile
}

export default function loadUtils(app) {
	Object.keys(fn).map(key => app.config.globalProperties[`$${key}`] = fn[key])
}