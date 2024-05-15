export function isExternal(path) {
	return /^(https?:|mailto:|tel:)/.test(path)
}

export function isString(str) {
	if (typeof str === 'string') {
		return true
	}
	return false
}

export function isArray(arg) {
	if (typeof Array.isArray === 'undefined') {
		return Object.prototype.toString.call(arg) === '[object Array]'
	}
	return Array.isArray(arg)
}

export function isEmail(email) {
	return /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(email);
}