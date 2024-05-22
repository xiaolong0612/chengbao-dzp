<script setup>
import Nine from "@/components/Nine.vue";
import { onMounted, ref } from "vue";
import { getQueryObject } from "@/utils";
import { useUserStore } from "@/stores/user";
import {getPrizeList, exchangeReward, remarkReward,getMyOwnRewardRecord} from "@/api/index";
import {showLoadingToast, showToast,closeToast} from "vant";

const user = useUserStore()
user.token = getQueryObject(location.href).token

const awardList = ref([])
const gift = ref({})
const show = ref(false)
const loading = ref(false);
const finished = ref(false);
const message = ref('')
const showRecord = ref(false);
const pageNum = ref(1);
const myAwardList = ref([])

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
    show.value = true;
    gift.value = item;
  }
}
function exchangeRewardFn() {
  //实物商品
  showLoadingToast("加载中");
  exchangeReward({
    "recordId":gift.value.recordId,
  }).then(res=>{
    closeToast();
    showToast("操作成功");
    show.value = false;
  })
}

function onLoad() {
  getMyOwnRewardRecord({
    "pageNum":pageNum.value,
    "pageSize":20,
  }).then(result => {
    myAwardList.value = myAwardList.value.concat(result.data.data)
    loading.value = false;
    finished.value = result.data.total <= pageNum.value * 20;
    pageNum.value = pageNum.value+1;
  })
}

function showRecordFn(){
  showRecord.value = true;
}
function submit() {

  if(['3','5'].includes(gift.value.prizeType)){
    //实物商品
    if(message.value ===""){
      showToast("请输入留言，联系方式或收货地址");
      return;
    }
    showLoadingToast("加载中");
    remarkReward({
      "recordId":gift.value.recordId,
      "remark":message.value
    }).then(res=>{
      closeToast();
      showToast("操作成功");
    })
  }
  show.value = false
}
onMounted(() => {
  initWard()
})

function recordOpenFn(){

  pageNum.value = 1;
  finished.value = false;
  myAwardList.value = [];
  onLoad();
}
function gonnaShowReward(item){
  if(item.isSend !=='1')return;
  show.value = true;
  gift.value = {
    prizeName:item.hitPrize,
    recordId:item.id,
    prizeType:'3',
    prizeValue:item.prizeValue,
    remark:item.remark,
  };
  message.value = item.remark;
}
</script>
<template>

  <div class="my-nav" @click="showRecordFn">
    中奖记录
  </div>
  <nine @change="lotteryChange" :awardList="awardList" />

  <van-popup @opened="recordOpenFn" v-model:show="showRecord" round position="bottom" :style="{ height: '70%',width:'100%',backgroundColor:'white' }" class="custon-popup" :close-on-click-overlay="true">
    <div class="px-30 pt-30 text-white record-bg">
      <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
      >
        <div v-for="item in myAwardList" @click="gonnaShowReward(item)" :key="item" :title="item" class="bg-[rgba(0,0,0,.7)] rounded p-20 mb-20">
          <div class="flex justify-between items-center">
            <div class="text-left">
              <div>
                {{ item.hitPrize }}
              </div>
              <div class="text-xs text-gray-300">
                领取时间：{{ item.createTime }}
              </div>
            </div>
            <div>
              <van-tag v-if="item.isSend == '4'" plain type="primary">发货中</van-tag>
              <van-tag v-if="item.isSend == '2'" plain type="success">已发放</van-tag>
              <van-tag v-if="item.isSend == '3'" plain type="danger">发放失败</van-tag>
              <van-tag v-if="item.isSend == '1'" plain type="warning">未发放</van-tag>
              <!-- <van-button class="bg-transparent" type="primary" round block plain hairline size="mini" @click="show = true">查看详情</van-button> -->
            </div>
          </div>
        </div>
      </van-list>
    </div>
  </van-popup>
  <van-popup v-model:show="show" round class="custon-popup"  :close-on-click-overlay="true">
    <div class="price_name"> {{gift.prizeName}}</div>
    <img :src="gift.poster" v-if="!!gift.poster" alt="" srcset="">
    <div class="rounded overflow-hidden my-20" v-if="['3','5'].includes(gift.prizeType)">
      <van-field
        v-model="message"
        rows="2"
        autosize
        type="textarea"
        maxlength="50"
        placeholder="请输入留言，联系方式或收货地址"
        show-word-limit
      />
    </div>
    <div class="flex">
      <div class="w-460 pr-20" v-if="['3','5'].includes(gift.prizeType)">
        <van-button type="primary" round block size="small" @click="exchangeRewardFn">兑换龙蛋：{{gift.prizeValue}}</van-button>
      </div>
      <van-button type="primary" round block :size="['3','5'].includes(gift.prizeType)?'small':'big'" @click="submit">确定</van-button>
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
.record-popup{
  background-color: black;
  width: 100%;
  height:40vh;

}
.price_name{
  color:white;
  font-size:14sp;
  text-align: center;
}
.award-wrap{
  height:10vw;
  border-radius:12px;
  background-color:#dcdee0;
  padding-left:5vw;
  padding-right:5vw;
  display: flex;
  align-items: center;
  margin-bottom: 2vw;
  margin-left: 4vw;
  margin-right: 4vw;
  justify-content: space-between;
}
.award-inside-text{
  font-size:4vw;
  color:#333333;
}
.record-bg{
  background-color:white;
  height:100%;
}
.my-nav{
  width:100%;
  text-align: right;
  padding-right:5vw;
  height:10vw;
  color:lightblue;
  font-size:4vw;
  line-height:10vw;
}
</style>