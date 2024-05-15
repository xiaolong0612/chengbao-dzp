<script setup>
import { ref, watch } from "vue";
import { showToast } from 'vant';
import { useI18n } from 'vue-i18n'
import telJSON from "@/utils/tel.js";
import { getCookie } from "@/utils/index.js";
import { isEmail } from "@/utils/validate.js";
import { register } from "@/api/user.js";
import { onMounted } from "vue";
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";

const user = useUserStore()
const router = useRouter()
const { t } = useI18n()

class Temp {
  name = ''
  email = ''
  country = ''
  phone = ''
  password = ''
  checkPassword = ''
  tradepass = ''
  checkTradepass = ''
  captcha = ''
  key = ''
}
const validatorEmail = val => {
  if (!isEmail(val)) {
    showToast(t('login.tip[3]'));
    return false
  }
  return true
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
const loading = ref(false)
const onSubmit = () => {
  loading.value = true
  query.value.key = getCookie('captchakey')
  register(query.value).then(result => {
    showToast(result.msg);
    user.login(query.value).then(() => {
      router.push('/')
    }).catch(() => {
      resetVerifyCodeUrl()
    }).finally(() => {
      loading.value = false
    })
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
  <VantHeader :left-arrow="true" :rightLang="true" :rightCustom="true"/>
  <div class="mt-60 px-40">
    <h2 class="text-4xl mb-50">{{ $t('register.createAccount') }}</h2>
    <van-form @submit="onSubmit" @failed="onFailed" ref="formRef">
      <van-cell-group :border="false">
        <van-field name="用户名" v-model="query.name" :label="$t('register.username')" label-align="top"
          :rules="[{ required: true }]" />
        <van-field name="邮箱" v-model="query.email" :label="$t('register.email')" label-align="top"
          :rules="[{ required: true, validator: validatorEmail }]" />
        <van-field name="国家" v-model="query.country" label-align="top" is-link readonly :label="$t('register.country')"
          placeholder="点击选择城市" @click="showCountryPicker = true" />
        <van-field name="电话" v-model="query.phone" :label="$t('register.tel')" label-align="top"
          :rules="[{ required: true }]" />
        <van-field name="密码" v-model="query.password" type="password" :label="$t('register.pwd')"
          label-align="top" :rules="[{ required: true }]" />
        <van-field name="确认密码" v-model="query.checkPassword" type="password" :label="$t('register.confirmPwd')"
          label-align="top" :rules="[{ required: true }]" />
        <van-field name="交易密码" v-model="query.tradepass" type="password" :label="$t('register.tradepass')"
          label-align="top" :rules="[{ required: true }]" />
        <p class="text-red-500 text-sm pl-30">{{ $t('register.tradepassTip') }}</p>
        <van-field name="确认交易密码" v-model="query.checkTradepass" type="password" :label="$t('register.confirmTradepass')"
          label-align="top" :rules="[{ required: true }]" />
        <van-field v-model="query.captcha" label-align="top" class="mt-30"
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
        <van-button :loading="loading" round block type="primary" size="large" native-type="submit" :color="isPass ? '' : '#999'">
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
  <div class="h-100"></div>
  <van-popup v-model:show="showCountryPicker" round position="bottom">
    <van-picker :columns="telJSON" @confirm="onConfirmCountry" @cancel="showCountryPicker = false" />
  </van-popup>
</template>