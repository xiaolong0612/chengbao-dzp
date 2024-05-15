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
const myAwardList = ref([])
const gift = ref({})
const show = ref(false)
const showRecord = ref(false)
const loading = ref(false);
const finished = ref(false);
const pageNum = ref(1);
const message = ref('')

function initWard() {
  getPrizeList().then(result => {
    result.data.forEach((item, index) => {
      item.order = index + 1
    });
    awardList.value = result.data
  })
}
function getRewardRecordList() {
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
function refreshRecordList(){
  pageNum.value = 1;
  loading.value = false;
  finished.value = false;
  myAwardList.value = [];

}
function hideRecord(){
  showRecord.value = false;
}
function showRecordFn(){
  showRecord.value = true;
  if(pageNum.value>1){
    //加载过的，refresh
    refreshRecordList();
  }
}
function lotteryChange (action, item) {
  // start fin 的行为反馈
  console.log(action, item)
  if (action === 'fin') {
    show.value = true;
    item.isReal = item.prizeType==='3'||item.prizeType==='5';
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
function submit() {
  if(gift.value.isReal){
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
</script>
<template>
  <van-nav-bar
    style="background-color: transparent;"
    right-text="中奖记录"
    @click-right="showRecordFn"
  />
  <nine @change="lotteryChange" :awardList="awardList" />

  <van-popup v-model:show="show" round class="custon-popup" :close-on-click-overlay="false">
    <div class="price_name"> {{gift.prizeName}}</div>
    <img :src="gift.poster" alt="" srcset="">
    <div class="rounded overflow-hidden my-20" v-if ="gift.isReal">
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
      <div class="w-460 pr-20" v-if="gift.isReal">
        <van-button type="primary" round block size="small" @click="exchangeRewardFn">兑换龙蛋：{{gift.prizeValue}}</van-button>
      </div>
      <van-button type="primary" round block :size="gift.isReal?'small':'big'" @click="submit">确定</van-button>
    </div>
  </van-popup>
    <van-popup
        :close="hideRecord"



        :style="{ height: '50%' ,padding: '10px',width:'100%',backgroundColor:'black'}" position="bottom" v-model:show="showRecord" round  :close-on-click-overlay="true">

    <div class="record-popup  my-20" >

      <van-list
          v-model:loading="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="getRewardRecordList"
      >

        <div v-for="(item,index) in myAwardList" class="award-wrap" :key="index" >

          <div class="award-inside-text">
            获得：{{item.hitPrize}}
          </div>
          <div>
            {{item.createTime}}
          </div>
        </div>
      </van-list>
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
</style>