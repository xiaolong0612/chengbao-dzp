<script setup>
import { onMounted, ref, watch } from "vue";
import { getCookie } from "@/utils/index.js";
import { useUserStore } from "@/stores/user";
import { useRouter } from "vue-router";

const router = useRouter()
const user = useUserStore()

class Temp {
  name = ''
  password = ''
  captcha = ''
  key = ''
}
const isPass = ref(false)
const formRef = ref(null)
const query = ref(new Temp())
const timer = ref(null)
watch(()=> query.value, () => {
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
const verifyCodeUrl = ref()
const resetVerifyCodeUrl = () => {
  verifyCodeUrl.value = import.meta.env.VITE_APP_BASE_URL + '/index/index/verify?' + new Date().getTime()
}
const loading = ref(false)
const onSubmit = () => {
  loading.value = true
  query.value.key = getCookie('captchakey')
  user.login(query.value).then(() => {
    router.push('/')
  }).catch(() => {
    resetVerifyCodeUrl()
  }).finally(() => {
    loading.value = false
  })
}
const onFailed = () => {
}
onMounted(() => {
  resetVerifyCodeUrl()
})
</script>
<template>
  <VantHeader :title="$t('tabs[0]')" :rightCustom="true" :rightLang="true" :leftArrow="true" />
  <div class="px-40 mt-60">
    <h2 class="text-4xl mb-50">{{ $t('login.title') }}</h2>
    <van-form @submit="onSubmit" @failed="onFailed" class="mt-80" ref="formRef">
      <van-cell-group :border="false">
        <van-field v-model="query.name" :label="$t('login.form.account')" label-align="top" name="用户名"
        :placeholder="$t('login.placeholder[0]')" :rules="[{ required: true }]" />
        <van-field v-model="query.password" type="password" :label="$t('login.form.password')" label-align="top"
          name="密码" :placeholder="$t('login.placeholder[1]')" :rules="[{ required: true }]" />
        <van-field v-model="query.captcha" label-align="top" :placeholder="$t('login.placeholder[2]')" class="mt-30" :rules="[{ required: true }]">
          <template #button>
            <van-image class="h-80 w-200" fit="cover" :src="verifyCodeUrl" @click="resetVerifyCodeUrl">
              <template v-slot:loading>
                <van-loading type="spinner" size="20" />
              </template>
            </van-image>
          </template>
        </van-field>
        <van-field disabled class="h-30" />
      </van-cell-group>
      <div class="mt-24">
        <van-button :loading="loading" round block type="primary" size="large" native-type="submit" :color="isPass ? '' : '#999'">
          {{ $t('login.login') }}
        </van-button>
      </div>
    </van-form>
  </div>
  <div class="mx-80 text-sm">
    <div class="mt-30">{{ $t("login.other.noa") }} ? <strong class="text-[#1989fa]" @click="router.push('/register')">{{ $t('login.register') }}</strong></div>
    <div class="mt-30"><strong class="text-[#1989fa]" @click="router.push('/forget')">{{ $t('login.other.getPwd') }}</strong></div>
  </div>
</template>