<template>
  <div>
    <div class="wrap">
      <div class="text-wrap">
        <img src="~@/assets/images/title.png" alt="" srcset="">
      </div>
      <div class="sudoku-wrap">
        <ul>
          <li
            :ref="`item${val.order}`"
            :data-index="val.order"
            :class="val.order >= 1 ? 'rw' : ''"
            v-for="val in resultList"
            :key="val.order"
          >
            <div v-if="val.order !== -9">
              <div class="header" v-if="val.poster"><img :src="val.poster" alt="" /></div>
              <div class="name">{{ val.prizeName }}</div>
            </div>
            <div v-else class="start text-center" @click.stop.prevent="startGo">
              <span class="absolute bottom-0 left-0 right-0 text-white text-xs">消耗龙蛋：{{gameCost}}</span>
            </div>
          </li>
        </ul>
      </div>
      <div class="rounded overflow-hidden my-20">
        <van-notice-bar :scrollable="false" color="#fff" background="rgba(0,0,0,.5)">
          <van-swipe
            vertical
            class="notice-swipe"
            :autoplay="3000"
            :show-indicators="false"
          >
            <van-swipe-item v-for="(item,index) in awardRecordList" :key="index">
              <div class="item">
<!--                <span>ID: {{item.uid}}</span>-->
                <span>{{item.nickname}}</span>
                <span>中奖：{{item.hitPrize}}</span>
              </div>
            </van-swipe-item>
          </van-swipe>
        </van-notice-bar>
      </div>
      <div class="tip text-sm">
        活动介绍：<br>
        {{gameInfo}}
      </div>
    </div>
  </div>
</template>

<script>
import {getGift, getGamesInfo, getPrizeList, getGameCost, getRewardRecord} from "@/api/index";
import {showLoadingToast,closeToast} from "vant";

export default {
  props: {
    awardList: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    awardList (val, oldval) {
      // 处理 最终的列表渲染顺序 已正常的排序思维顺序
      const keyObj = {}
      const arr = []
      const downArr = Object.assign([], val)
      if (downArr.length) {
        downArr.push({ order: -9 })
        downArr.forEach(element => {
          keyObj[element.order] = element
        })
        // 依据数组的顺序填充
        this.orderList.forEach(ele => {
          arr.push(keyObj[ele])
        })
      }
      this.resultList = arr
    }
  },
  data () {
    return {
      resultList: [], // 奖品列表
      isTurn: true, // 是否可以抽奖
      index: 1, //当前转动到哪个位置，起点位置
      orderList: [1, 2, 3, 8, -9, 4, 7, 6, 5], // 正常循环排列下的顺序 0 为中间的抽奖按钮/分区标识
      lotterywin: -9, // 中奖位置
      lotterywinr: {},
      gameInfo:"",
      gameCost:"",
      awardRecordList:[],
      lottery: {
        count: 8, //总共有多少个位置
        timer: 0, //setTimeout的ID，用clearTimeout清除
        speed: 35, //初始转动速度
        times: 0, //转动次数
        cynum: 50, // 圈数
        win: 0 //中奖位置 0 默认不中奖
      },
      // testIndex: 0,
      // testList: []
    }
  },
  mounted() {
    // this.testGo()
    this.getInfo();
    this.getGameCost();
    this.getRewardRecordList();
  },
  methods: {
    async getRewardRecordList() {
  getRewardRecord({
    "pageNum":1,
    "pageSize":10,
  }).then(result => {
    result.data.data.forEach((item, index) => {
      item.order = index + 1
    });
    this.awardRecordList = result.data.data
      })
    },
    async getInfo(){
      getGamesInfo().then(result => {
        this.gameInfo = result.data
      })
     },
    async getGameCost(){
      getGameCost().then(result => {
        this.gameCost = result.data
      })
    },
    async testGo () {
      const { data } = await getGift();
      let win = this.awardList.findIndex(item => item.prizeId == data.prizeId) + 1

      if(this.testList.find(item => item.prizeId == data.prizeId)){
        let index = this.testList.findIndex(item => item.prizeId == data.prizeId
)
        this.testList[index]['total'] += 1
      }else{
        data['total'] = 0
        this.testList.push(data)
      }
      console.log(this.testIndex);
      const max = 100
      if(this.testIndex < max){
        this.testIndex++
        this.testGo()
      }else{
        if(this.testIndex==max){
          console.log(this.testList);
        }
      }
    },
    async startGo () {
      if (!this.isTurn) return
      this.isTurn = false // 等待下一次开启 注：接口失败等异常情况 需要重置
      // await api 获取中奖信息 （因为数据结构的定义，这里拿到中奖位置将变得非常 esay）
      showLoadingToast("加载中");
      const { data } = await getGift();
      closeToast();
      this.lotterywinr = data
      let win = this.awardList.findIndex(item => item.prizeId == data.prizeId) + 1 // 中奖位置
      if (!win) return
      this.$emit('change', 'start', {})
      this.lotterywin = win
      this._rolling()
    },
    resetData () {
      // 数据重置
      this.index = 1
      this.isTurn = true
      this.lottery = {
        count: 8, // 位置数量 九宫格八个奖品位置
        timer: 0, // setTimeout 容器
        speed: 35, //初始转动速度
        times: 0, //转动次数
        cynum: 50, // 圈数
        end: 0 //中奖位置 0 默认不中奖
      }
    },
    _roll_actived () {
      // running 选中的状态
      let pre = this.index - 1
      if (this.index > this.lottery.count) this.index = 1
      const preDom = this.$refs['item' + pre]
      const downDom = this.$refs['item' + this.index]
      if (pre > 0 && preDom) {
        preDom[0].classList.remove('active')
      }
      if (downDom) {
        downDom[0].classList.add('active')
      }
    },
    _rolling () {
      this.lottery.times++
      this._roll_actived()
      // +10 将速度降下来的圈数周期
      if (
        this.lottery.times > this.lottery.cynum + 10 &&
        this.lotterywin === this.index
      ) {
        clearTimeout(this.lottery.timer)
        setTimeout(() => {
          this.resetData()
          this.$emit('change', 'fin', Object.assign({}, this.awardList[this.lotterywin], this.lotterywinr))
        }, 1000) // 此时间给予用户感受中奖反馈时间
      } else {
        if (this.lottery.times > this.lottery.cynum) this.lottery.speed += 20 // 惯性 越来越慢
        this.index++
        this.lottery.timer = setTimeout(this._rolling, this.lottery.speed)
      }
    }
  }
}
</script>
<style>
.van-van-__text{
  color: #fff;
}
</style>
<style scoped lang="scss">
.wrap{
  padding: 0 .5rem;
}
.notice-swipe {
  height: 40px;
  line-height: 40px;
  .item{
    span{
      padding-right: .2rem;
    }
  }
}
.text-wrap{
  padding: 0.5rem 0;
}
.text-wrap img{
  width: 100%;
}
.title:nth-child(2){
  text-align: right;
}
.tip,
.sudoku-wrap {
  /* width: 6.02rem; */
  /* height: 6.7rem; */
  margin: 0 auto;
  /* background-image: url('./../assets/images/lottery_box_bg.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center center; */
  background-color: rgba(0,0,0,.5);
  border-radius: 10px;
  padding: 0.5rem 0;
}
.sudoku-wrap ul {
  display: flex;
  display: -webkit-flex;
  flex-wrap: wrap;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
}
.sudoku-wrap ul li {
  width: 180px;
  height: 180px;
  margin: 0 20px 20px 0;
  background-image: url('../assets/images/item_bg.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center center;
  position: relative;
}
.sudoku-wrap ul li:nth-child(3),
.sudoku-wrap ul li:nth-child(6),
.sudoku-wrap ul li:nth-child(9) {
  margin-right: 0;
}
.sudoku-wrap ul li:nth-child(7),
.sudoku-wrap ul li:nth-child(8),
.sudoku-wrap ul li:nth-child(9) {
  margin-bottom: 0;
}
.sudoku-wrap ul li img {
  width: 100%;
}
.sudoku-wrap ul .start {
  width: 180px;
  height: 180px;
  background-image: url('../assets/images/start.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center center;
}
.sudoku-wrap ul li.xx .item-xx {
  width: 1rem;
  height: 1rem;
  line-height: 0.4rem;
  margin: 0.2rem auto 0 auto;
  background-color: #041726;
  padding: 0.14rem 0.14rem 0.14rem 0.16rem;
  font-size: 0.33rem;
  color: #035d68;
}
.sudoku-wrap ul li.rw {
  padding-top: 0.14rem;
}
.sudoku-wrap ul li.rw .header {
  height: 100px;
}
.sudoku-wrap ul li.rw img {
  width: 170px;
  height: 100px;
  margin: 0 auto;
}
.sudoku-wrap ul li.rw .name {
  margin: 0 auto;
  text-align: center;
  font-size: 12px;
  background-image: url('../assets/images/name_bg.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center center;
  color: #00ffff;
}
.sudoku-wrap ul li.active::after {
  content: ' ';
  display: block;
  position: absolute;
  top: 0;
  left: 0.05rem;
  width: 100%;
  height: 100%;
  background: url('../assets/images/active.gif') center no-repeat;
  background-color: rgba(188, 133, 28, 0.3);
  background-size: 100%;
}
.sudoku-wrap ul li.active .name {
  // background-image: url('../assets/images/name_current_bg.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center center;
  color: #fff;
}

.tip{
  color: #fff;
  padding: 30px;
}
</style>
