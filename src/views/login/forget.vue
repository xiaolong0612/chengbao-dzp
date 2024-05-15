<script setup>
import Lang from "@/components/Lang.vue";
import { ref, watch, onMounted } from "vue";
import { showToast } from 'vant';
import { useI18n } from 'vue-i18n'
import telJSON from "@/utils/tel.js";
import { useRouter } from "vue-router";

const router = useRouter()
const { t } = useI18n()

const handleLangBtn = () => {
  console.log(123)
}
const handleBack = () => {

}
class Temp {
  account = ''
  email = ''
  country = '+1'
  phone = ''
  password = ''
  checkPassword = ''
  tradepass = ''
  checkTradepass = ''
  captcha = ''
}
const isPass = ref(false)
const formRef = ref(null)
const query = ref(new Temp())
const timer = ref(null)
watch(() => query.value, () => {
  clearTimeout(timer.value)
  timer.value = setTimeout(() => {
    formRef.value.validate().then(() => {
      isPass.value = true
    }).catch(() => {
      isPass.value = false
    })
  }, 300)
}, {
  deep: true
})

const showCountryPicker = ref(false)
const onConfirmCountry = result => {
  query.value.country = result.selectedValues[0]
  showCountryPicker.value = false
}

const onSubmit = () => {
  console.log(2222)
}
const onFailed = () => {}
const verifyCodeUrl = ref()
const resetVerifyCodeUrl = () => {
  verifyCodeUrl.value = import.meta.env.VITE_APP_BASE_URL + '/index/index/verify?' + new Date().getTime()
}
onMounted(() => {
  resetVerifyCodeUrl()
})
</script>
<template>
  <van-nav-bar :border="false" left-arrow @click-left="handleBack">
    <template #right>
      <Lang />
    </template>
  </van-nav-bar>
  <div class="mt-60 px-40">
    <h2 class="text-4xl mb-50">{{ $t('forget.title') }}</h2>
    <van-form @submit="onSubmit" @failed="onFailed" ref="formRef">
      <van-cell-group :border="false">
        <van-field name="用户名" v-model="query.account" :label="$t('forget.account')"
          :rules="[{ required: true }]" />
        <van-field name="密码" v-model="query.password" type="password" :label="$t('register.pwd')"
         :rules="[{ required: true }]" />
        <van-field name="确认密码" v-model="query.checkPassword" type="password" :label="$t('register.confirmPwd')"
         :rules="[{ required: true }]" />
        <van-field name="交易密码" v-model="query.tradepass" type="password" :label="$t('register.tradepass')"
         :rules="[{ required: true }]" />
        <van-field v-model="query.code" class="mt-30"
          :rules="[{ required: true }]">
          <template #button>
            <van-image class="h-80 w-300" fit="contain" :src="verifyCodeUrl" @click="resetVerifyCodeUrl">
              <template v-slot:loading>
                <van-loading type="spinner" size="20" />
              </template>
            </van-image>
          </template>
        </van-field>
        <van-field disabled class="h-30" />
      </van-cell-group>
      <div class="mt-24 mx-30">
        <van-button round block type="primary" size="large" native-type="submit" :color="isPass ? '' : '#999'">
          {{ $t('login.register') }}
        </van-button>
      </div>
    </van-form>
  </div>
  <div class="mx-80 text-sm">
    <div class="mt-30">
      {{ $t('register.hasAccount') }} ? <strong class="text-[#1989fa]" @click="router.push('/login')">{{ $t('register.login') }}</strong>
    </div>
  </div>
  <van-popup v-model:show="showCountryPicker" round position="bottom">
    <van-picker :columns="telJSON" @confirm="onConfirmCountry" @cancel="showCountryPicker = false" />
  </van-popup>
</template>