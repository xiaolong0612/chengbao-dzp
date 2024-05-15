import defaultSettings from '@/settings'
import { sessionCache } from '@/utils'
const title = sessionCache.getItemCache('APP', 'title') || defaultSettings.title
export default function getPageTitle(pageTitle) {
	if (pageTitle) {
		return `${pageTitle} - ${title}`
	}
	return `${title}`
}
