// vue-i18n所需要引入的
import { createI18n } from 'vue-i18n'
// vant所需要引入的
import { Locale } from 'vant'
import Cookie from 'js-cookie'

// 本地的文件夹
import zhLocale from './zh.json'
import zhHkLocale from './zh-hk.json'
import esLocale from './es.json'
import trLocale from './tr.json'
import koLocale from './ko.json'
import frLocale from './fr.json'
import deLocale from './de.json'
import faLocale from './fa-ir.json'
import enLocale from './en.json'
import itLocale from './it.json'
import ptLocale from './pt.json'
import arLocale from './ar.json'
// vant中的文件夹  需要的语言和本地的语言保持一致
import zhCN from 'vant/lib/locale/lang/zh-CN'
import zhHK from 'vant/lib/locale/lang/zh-HK'
import esEs from 'vant/lib/locale/lang/es-ES'
import trTr from 'vant/lib/locale/lang/tr-TR'
import koKR from 'vant/lib/locale/lang/ko-KR'
import frFR from 'vant/lib/locale/lang/fr-FR'
import deDE from 'vant/lib/locale/lang/de-DE'
import faIR from 'vant/lib/locale/lang/fa-IR'
import enUS from 'vant/lib/locale/lang/en-US'
import itIT from 'vant/lib/locale/lang/it-IT'
import ptBR from 'vant/lib/locale/lang/pt-BR'
import arSA from 'vant/lib/locale/lang/ar-SA'
const messages = {
  // '中文简体'
  'zh-cn': {
    ...zhCN,
    ...zhLocale
  },
  // 意大利语--Italiano
  // 'it-it': {
  //   ...itIT,
  //   ...itLocale
  // },
  // // 阿拉伯语--عربي
  // 'ar-dz': {
  //   ...arSA,
  //   ...arLocale
  // },
  // 英语--English
  'en-us': {
    ...enUS,
    ...enLocale
  },
  // 西班牙语--español
  'es-es': {
    ...esEs,
    ...esLocale
  },
  // 土耳其语--Türkçe
  'tr-tr': {
    ...trTr,
    ...trLocale
  },
  // 葡萄牙语--Português
  'pt-pt': {
    ...ptBR,
    ...ptLocale
  },
  // 韩语--한국인
  'ko-kr': {
    ...koKR,
    ...koLocale
  },
  // 法语--Français
  'fr-fr': {
    ...frFR,
    ...frLocale
  },
  // 德语--Deutsch
  'de-de': {
    ...deDE,
    ...deLocale
  },
  // 波斯语--فارسی
  'fa-ir': {
    ...faIR,
    ...faLocale
  },
  // 中文繁體
  'zh-hk': {
    ...zhHK,
    ...zhHkLocale
  },
}
const messageList = []
let showLang = ['中文简体', 'English', 'español','Türkçe', 'Português', '한국인', 'Français', 'Deutsch', 'فارسی', '中文繁體']
Object.keys(messages).map((key, index) => {
  messageList.push({
    label: showLang[index],
    value: key
  })
})
// 更新vant组件库本身的语言变化，支持国际化
function vantLocales (lang) {
  Locale.use(lang, messages[lang])
}
// 默认语言
const lang = 'zh-cn'
const language = localStorage.getItem('language') || lang
localStorage.setItem('language', language)
Cookie.set('Think_lang', language)
const i18n = createI18n({
  // Not available in legacy mode 解决报错问题的配置项！！！
  legacy: false,
  // 全局注册 $t方法
  globalInjection: true,
  // 设置初始化语言
  locale: language,
  // 设置备用语言
  fallbackLocale: 'zh-cn',
  messages
})
export { i18n, messageList, vantLocales }
