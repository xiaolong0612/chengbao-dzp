<script setup>
import Nine from "@/components/Nine.vue";
import { onMounted, ref } from "vue";
import { getQueryObject } from "@/utils";
import { useUserStore } from "@/stores/user";
import { getPrizeList } from "@/api/index";

const user = useUserStore()
user.token = getQueryObject(location.href).token

const awardList = ref([])
const gift = ref({})
const show = ref(false)
const message = ref('')

function initWard() {
  getPrizeList().then(result => {
    result.data.forEach((item, index) => {
      item.order = index + 1
    });
    awardList.value = result.data
  })
}
function lotteryChange (action, item) {
  // start fin 的行为反馈
  console.log(action, item)
  if (action === 'fin') {
    show.value = true
    gift.value = item
  }
}
function submit() {
  show.value = false
}
onMounted(() => {
  initWard()
})
</script>
<template>
  <van-nav-bar
    style="background-color: transparent;"
    right-text="中奖记录"
    @click-right="onClickRight"
  />
  <nine @change="lotteryChange" :awardList="awardList" />

  <van-popup v-model:show="show" round class="custon-popup" :close-on-click-overlay="false">
    <img :src="$getAssetsFile('images/bg.jpg')" alt="" srcset="">
    <div class="rounded overflow-hidden my-20">
      <van-field
        v-model="message"
        rows="2"
        autosize
        type="textarea"
        maxlength="50"
        placeholder="请输入留言，联系方式或收获地址"
        show-word-limit
      />
    </div>
    <div class="flex">
      <div class="w-460 pr-20">
        <van-button type="primary" round block size="small">兑换龙蛋：100</van-button>
      </div>
      <van-button type="primary" round block size="small" @click="submit">确定</van-button>
    </div>
  </van-popup>
</template>

<style lang="scss" scoped>
.custon-popup{
  background-color: transparent;
  width: 80vw;
  img{
    width: 100%;
    margin: .3rem 0;
  }
}
</style>