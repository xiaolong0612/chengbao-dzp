<script setup>
import { messageList, vantLocales } from '@/lang'
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n'
import Cookie from 'js-cookie'
const { locale } = useI18n();

const lang = computed(() => {
  return messageList.find(item => item.value == locale.value)
})

const showlang = ref(false)
const handleLangItem = item => {
  locale.value = item.value
  vantLocales(item.value)
  localStorage.setItem('language', item.value)
  Cookie.set('Think_lang', item.value)
  showlang.value = false
}
</script>
<template>
  <div class="text-black flex items-center" @click="showlang = true">
    <div class="text-xs pr-3">{{ lang.label }}</div>
    <van-icon color="#333" name="miniprogram-o" size="18" />
  </div>
  <van-popup v-model:show="showlang" round :style="{ padding: '0' }">
    <van-list class="w-360">
      <van-cell v-for="item in messageList" :key="item.value" :title="item.label" @click="handleLangItem(item)" />
    </van-list>
  </van-popup>
</template>