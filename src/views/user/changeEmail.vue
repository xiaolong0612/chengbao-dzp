<script setup>
import { ref, watch, onMounted } from "vue";
import { showToast } from 'vant';
import { useI18n } from 'vue-i18n'
import { isEmail } from "@/utils/validate.js";
import { useRouter } from "vue-router";
import { changePwd } from "@/api/user.js";

const router = useRouter()
const { t } = useI18n()

const handleLangBtn = () => {
  console.log(123)
}
const handleBack = () => {

}
class Temp {
  password = ''
  email = ''
  checkEmail = ''
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
const validatorEmail = val => {
  if (!isEmail(val)) {
    showToast(t('login.tip[3]'));
    return false
  }
  return true
}
const validatorCheckEmail = val => {
  if (val != query.value.email) {
    showToast(t('safeCenter.emailNoSame'));
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
  <vant-header :title="$t('safeCenter.changeEmail')" :left-arrow="true" />
  <div class="mt-60 px-40">
    <van-form @submit="onSubmit" @failed="onFailed" ref="formRef">
      <van-cell-group :border="false">
        <van-field name="邮箱" v-model="query.email" label-align="top" :label="$t('register.email')"
         :rules="[{ trigger: 'onBlur', required: true, validator: validatorEmail }]" :placeholder="$t('user.placeholder4')"/>
        <van-field name="确认邮箱" v-model="query.checkEmail" label-align="top" :label="$t('register.email')"
         :rules="[{ trigger: 'onBlur', required: true, validator: validatorCheckEmail }]" :placeholder="$t('user.placeholder5')"/>
        <van-field name="交易密码" v-model="query.tradepass" label-align="top" type="password" :label="$t('register.tradepass')"
         :rules="[{ trigger: 'onBlur', required: true }]" :placeholder="$t('user.placeholder3')"/>
        <van-field disabled class="h-30" />
      </van-cell-group>
      <div class="mt-24 mx-30">
        <van-button round block type="primary" size="large" native-type="submit" :color="isPass ? '' : '#999'">
          {{ $t('confirm') }}
        </van-button>
      </div>
    </van-form>
  </div>
</template>