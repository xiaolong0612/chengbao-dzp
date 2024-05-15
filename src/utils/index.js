/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
	if (arguments.length === 0 || !time) {
		return null
	}
	const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
	let date
	if (typeof time === 'object') {
		date = time
	} else {
		if ((typeof time === 'string')) {
			if ((/^[0-9]+$/.test(time))) {
				// support "1548221490638"
				time = parseInt(time)
			} else {
				// support safari
				// https://stackoverflow.com/questions/4310953/invalid-date-in-safari
				time = time.replace(new RegExp(/-/gm), '/')
			}
		}

		if ((typeof time === 'number') && (time.toString().length === 10)) {
			time = time * 1000
		}
		date = new Date(time)
	}
	const formatObj = {
		y: date.getFullYear(),
		m: date.getMonth() + 1,
		d: date.getDate(),
		h: date.getHours(),
		i: date.getMinutes(),
		s: date.getSeconds(),
		a: date.getDay()
	}
	const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
		const value = formatObj[key]
		// Note: getDay() returns 0 on Sunday
		if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
		return value.toString().padStart(2, '0')
	})
	return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
	if (('' + time).length === 10) {
		time = parseInt(time) * 1000
	} else {
		time = +time
	}
	const d = new Date(time)
	const now = Date.now()

	const diff = (now - d) / 1000

	if (diff < 30) {
		return '刚刚'
	} else if (diff < 3600) {
		// less 1 hour
		return Math.ceil(diff / 60) + '分钟前'
	} else if (diff < 3600 * 24) {
		return Math.ceil(diff / 3600) + '小时前'
	} else if (diff < 3600 * 24 * 2) {
		return '1天前'
	}
	if (option) {
		return parseTime(time, option)
	} else {
		return (
			d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
		)
	}
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function getQueryObject(url) {
	url = url == null ? window.location.href : url
	const search = url.substring(url.lastIndexOf('?') + 1)
	const obj = {}
	const reg = /([^?&=]+)=([^?&=]*)/g
	search.replace(reg, (rs, $1, $2) => {
		const name = decodeURIComponent($1)
		let val = decodeURIComponent($2)
		val = String(val)
		obj[name] = val
		return rs
	})
	return obj
}

/**
 * @param {string} input value
 * @returns {number} output value
 */
export function byteLength(str) {
	// returns the byte length of an utf8 string
	let s = str.length
	for (var i = str.length - 1; i >= 0; i--) {
		const code = str.charCodeAt(i)
		if (code > 0x7f && code <= 0x7ff) s++
		else if (code > 0x7ff && code <= 0xffff) s += 2
		if (code >= 0xDC00 && code <= 0xDFFF) i--
	}
	return s
}

/**
 * @param {Array} actual
 * @returns {Array}
 */
export function cleanArray(actual) {
	const newArray = []
	for (let i = 0; i < actual.length; i++) {
		if (actual[i]) {
			newArray.push(actual[i])
		}
	}
	return newArray
}

/**
 * @param {Object} json
 * @returns {Array}
 */
export function param(json) {
	if (!json) return ''
	return cleanArray(
		Object.keys(json).map(key => {
			if (json[key] === undefined) return ''
			return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
		})
	).join('&')
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
	const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
	if (!search) {
		return {}
	}
	const obj = {}
	const searchArr = search.split('&')
	searchArr.forEach(v => {
		const index = v.indexOf('=')
		if (index !== -1) {
			const name = v.substring(0, index)
			const val = v.substring(index + 1, v.length)
			obj[name] = val
		}
	})
	return obj
}

/**
 * @param {string} val
 * @returns {string}
 */
export function html2Text(val) {
	const div = document.createElement('div')
	div.innerHTML = val
	return div.textContent || div.innerText
}

/**
 * Merges two objects, giving the last one precedence
 * @param {Object} target
 * @param {(Object|Array)} source
 * @returns {Object}
 */
export function objectMerge(target, source) {
	if (typeof target !== 'object') {
		target = {}
	}
	if (Array.isArray(source)) {
		return source.slice()
	}
	Object.keys(source).forEach(property => {
		const sourceProperty = source[property]
		if (typeof sourceProperty === 'object') {
			target[property] = objectMerge(target[property], sourceProperty)
		} else {
			target[property] = sourceProperty
		}
	})
	return target
}

/**
 * @param {HTMLElement} element
 * @param {string} className
 */
export function toggleClass(element, className) {
	if (!element || !className) {
		return
	}
	let classString = element.className
	const nameIndex = classString.indexOf(className)
	if (nameIndex === -1) {
		classString += '' + className
	} else {
		classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length)
	}
	element.className = classString
}

/**
 * @param {string} type
 * @returns {Date}
 */
export function getTime(type) {
	if (type === 'start') {
		return new Date().getTime() - 3600 * 1000 * 24 * 90
	} else {
		return new Date(new Date().toDateString())
	}
}

/**
 * @param {Function} func
 * @param {number} wait
 * @param {boolean} immediate
 * @return {*}
 */
export function debounce(func, wait, immediate) {
	let timeout, args, context, timestamp, result

	const later = function() {
		// 据上一次触发时间间隔
		const last = +new Date() - timestamp

		// 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
		if (last < wait && last > 0) {
			timeout = setTimeout(later, wait - last)
		} else {
			timeout = null
			// 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
			if (!immediate) {
				result = func.apply(context, args)
				if (!timeout) context = args = null
			}
		}
	}

	return function(...args) {
		context = this
		timestamp = +new Date()
		const callNow = immediate && !timeout
		// 如果延时不存在，重新设定延时
		if (!timeout) timeout = setTimeout(later, wait)
		if (callNow) {
			result = func.apply(context, args)
			context = args = null
		}
		return result
	}
}

/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
export function deepClone(source) {
	if (!source && typeof source !== 'object') {
		throw new Error('error arguments', 'deepClone')
	}
	const targetObj = source.constructor === Array ? [] : {}
	Object.keys(source).forEach(keys => {
		if (source[keys] && typeof source[keys] === 'object') {
			targetObj[keys] = deepClone(source[keys])
		} else {
			targetObj[keys] = source[keys]
		}
	})
	return targetObj
}

/**
 * @param {Array} arr
 * @returns {Array}
 */
export function uniqueArr(arr) {
	return Array.from(new Set(arr))
}

/**
 * @returns {string}
 */
export function createUniqueString() {
	const timestamp = +new Date() + ''
	const randomNum = parseInt((1 + Math.random()) * 65536) + ''
	return (+(randomNum + timestamp)).toString(32)
}

/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele, cls) {
	return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}

/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele, cls) {
	if (!hasClass(ele, cls)) ele.className += ' ' + cls
}

/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele, cls) {
	if (hasClass(ele, cls)) {
		const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
		ele.className = ele.className.replace(reg, ' ')
	}
}

/**
 * localStorage, sessionStorage
 * setCache, getCache, removeCache 处理 Storage value = 字符串
 * setItemCache, getItemCache, removerItemCache 处理 Storage value = JSON
 * clear 清除 Storage
 */
class Cache {
	// 使用构造器，区分是 localStorage 还是 sessionStorage 存储
	constructor(isLocal = true){
		this.storage = isLocal ? localStorage : sessionStorage
	}

	setCache(key,value){
		// localStorage 本身不能存储对象类型的数据,所以要使用 JSON.stringify() 将对象转成字符串                
		this.storage.setItem(key,JSON.stringify(value))
	}
	getCache(key){
		const result = this.storage.getItem(key)
		// 因为存储时已经将对象转为字符串了，所以在获取时要使用 JSON.parse() 转回对象类型
		// 获取值时要将字符串类型的数据转为对象类型
		// 因为如果是 undefined 会报错，所以在这里加一个判断更严谨
		if(result){
			try {
				return JSON.parse(result)
			} catch (error) {
				return result
			}
		}
	}
	removeCache(key){
		return this.storage.removeItem(key)
	}
	// val 为JONS对象时的处理
	setItemCache(module, key, value){
		const result = JSON.parse(this.storage.getItem(module))
		result[key] = value
		this.storage.setItem(module, JSON.stringify(result))
	}
	getItemCache(module, key){
		const result = this.storage.getItem(module)
		if(result){
			return JSON.parse(result)[key]
		}
	}
	removerItemCache(key){
		const result = JSON.parse(this.storage.getItem(module))
		delete result[key]
		this.storage.setItem(module, JSON.stringify(result))
	}
	clear(){
		this.storage.clear()
	}
}
export const localCache  = new Cache()
export const sessionCache  = new Cache(false)

/**
 * 格式化图片地址
 * @param {String} url 
 * @returns 
 */
export function formatImgPath(url) {
	let image = ''
	//当地址不存在
	if (url) {
		if (/^data:image\//.test(url)) {
			image = url
		} else if (/^(http|https):\/\/.+/.test(url)) {
			image = url 
		} else {
			image = import.meta.env.VITE_APP_BASE_URL + url
		}
	} else {
		console.log('失败了', url)
		image = import.meta.env.VITE_APP_BASE_URL + '/images/default.jpg'
	}
	return image
}

/**
 * 随机密码
 * @param {Number} length 
 * @returns 
 */
export function randomPwd(length = 6) {
	const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
	let password = ''
	for (let i = 0; i < length; i++) {
		const randomIndex = Math.floor(Math.random() * characters.length)
		password += characters[randomIndex]
	}
	return password
}
/**
 * 检测密码强度
 * @param {String} pwd 
 * @param {Number} len 
 * @returns 
 */
export function checkPwdLevel (pwd, len = 6) {
	let level = 0
	if (pwd.length < len) return 0
	if (pwd.match(/[a-z]/g)) level++
	if (pwd.match(/[A-Z]/g)) level++
	if (pwd.match(/[0-9]/g)) level++
	if (pwd.match(/[!@#$%^&*(),.?":{}|<>]/g)) level++
	if (pwd.length > 13) level++
	return level
}

export function detectOS() { 
	var sUserAgent = navigator.userAgent 

	var isWin = (navigator.platform == 'Win32') || (navigator.platform == 'Windows') 
	var isMac = (navigator.platform == 'Mac68K') || (navigator.platform == 'MacPPC') || (navigator.platform == 'Macintosh') || (navigator.platform == 'MacIntel') 
	if (isMac) return 'Mac' 
	var isUnix = (navigator.platform == 'X11') && !isWin && !isMac 
	if (isUnix) return 'Unix' 
	var isLinux = (String(navigator.platform).indexOf('Linux') > -1) 

	var bIsAndroid = sUserAgent.toLowerCase().match(/android/i) == 'android'
	if (isLinux) {
		if(bIsAndroid) return 'Android'
		else return 'Linux' 
	}
	if (isWin) { 
		var isWin2K = sUserAgent.indexOf('Windows NT 5.0') > -1 || sUserAgent.indexOf('Windows 2000') > -1 
		if (isWin2K) return 'Win2000' 
		var isWinXP = sUserAgent.indexOf('Windows NT 5.1') > -1 || 
sUserAgent.indexOf('Windows XP') > -1 
		if (isWinXP) return 'WinXP' 
		var isWin2003 = sUserAgent.indexOf('Windows NT 5.2') > -1 || sUserAgent.indexOf('Windows 2003') > -1 
		if (isWin2003) return 'Win2003' 
		var isWinVista= sUserAgent.indexOf('Windows NT 6.0') > -1 || sUserAgent.indexOf('Windows Vista') > -1 
		if (isWinVista) return 'WinVista' 
		var isWin7 = sUserAgent.indexOf('Windows NT 6.1') > -1 || sUserAgent.indexOf('Windows 7') > -1 
		if (isWin7) return 'Win7' 
	} 
	return 'other' 
} 

// Array to JSON
// let a = [{key: 'name',value: 'amber'}, {key: 'age',value: 2}]
// let b = a.reduce((obj, item) => (obj[item.key] = item.value,obj), {})
// {name: amber, age: 2}

export function bytesToSize($bytesize) {
	let $i = 0
	// 当$bytesize 大于是1024字节时，开始循环，当循环到第4次时跳出；
	while (Math.abs($bytesize) >= 1024) {
		$bytesize = $bytesize / 1024
		$i++
		if ($i === 4) break
	}
	// 将Bytes,KB,MB,GB,TB定义成一维数组；
	const $units = ['Bytes', 'KB', 'MB', 'GB', 'TB']
	const $newsize = Math.round($bytesize, 2)
	return $newsize + ' ' + $units[$i]
}

export function getAssetsFile(url) {
	return new URL(`../assets/${url}`, import.meta.url).href
}

export function imageToBase64(url) {
	return new Promise((resolve, reject) => {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', url, true);
		xhr.responseType = 'blob';
	 
		xhr.onload = function() {
			var reader = new FileReader();
			reader.onloadend = function() {
				resolve(reader.result)
			};
			reader.readAsDataURL(xhr.response);
		};
	 
		xhr.send();
	})
}

export function getCookie(name) {
  var cookieArr = document.cookie.split("; ");
  for (var i = 0; i < cookieArr.length; i++) {
    var cookiePair = cookieArr[i].split("=");
    if (cookiePair[0] === name) {
      return decodeURIComponent(cookiePair[1]);
    }
  }
  return null;
}

export function getRandomNumber(min, max) {
	return Math.random() * (max - min) + min;
}

export function generateRandomNickname() {
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let nickname = '';
	for (let i = 0; i < 4; i++) {
			nickname += characters.charAt(Math.floor(Math.random() * characters.length));
	}
	return nickname;
}
export function getRandomDate(startDate = new Date(2023,9,1), endDate = new Date()) {
  var start = startDate; // 设置可选择的日期范围起始点
  var end = endDate; // 设置可选择的日期范围结束点（当前日期）
 
  var randomMillis = Math.floor(Math.random() * (end.getTime() - start.getTime() + 1) + start.getTime());
 
  return new Date(randomMillis);
}