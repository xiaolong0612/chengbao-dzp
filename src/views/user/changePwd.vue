<script setup>
import { ref, watch, onMounted } from "vue";
import { showToast } from 'vant';
import { useI18n } from 'vue-i18n'
import { useRouter } from "vue-router";
import { changePwd } from "@/api/user.js";

const router = useRouter()
const { t } = useI18n()

class Temp {
  email = ''
  password = ''
  checkPassword = ''
  tradepass = ''
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
const validatorCheckPassword = val => {
  if (val != query.value.password) {
    showToast(t('safeCenter.pwdNoSame'));
    return false
  }
  return true
}

const loading = ref(false)
const onSubmit = () => {
  loading.value= true
  changePwd(query.value).then(result => {
    router.back()
  }).finally(() => {
    loading.value = false
  })
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
  <vant-header :title="$t('safeCenter.changePwd')" :left-arrow="true" />
  <div class="mt-60 px-40">
    <van-form @submit="onSubmit" @failed="onFailed" ref="formRef">
      <van-cell-group :border="false">
        <van-field name="密码" v-model="query.password" label-align="top" :label="$t('register.pwd')"
         :rules="[{ required: true }]" :placeholder="$t('user.placeholder1')" />
        <van-field name="确认密码" v-model="query.checkPassword" label-align="top" :label="$t('register.confirmPwd')"
         :rules="[{ required: true, validator: validatorCheckPassword }]" :placeholder="$t('user.placeholder2')" />
        <van-field name="交易密码" v-model="query.tradepass" label-align="top" type="password" :label="$t('register.tradepass')"
         :rules="[{ required: true }]" :placeholder="$t('user.placeholder3')" />
        <van-field disabled class="h-30" />
      </van-cell-group>
      <div class="mt-24 mx-30">
        <van-button :loading="loading" round block type="primary" size="large" native-type="submit" :color="isPass ? '' : '#999'">
          {{ $t('confirm') }}
        </van-button>
      </div>
    </van-form>
  </div>
</template>