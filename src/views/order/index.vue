<script setup>
import { ref } from 'vue';
import {getMyOwnRewardRecord} from "@/api/index";

const myAwardList = ref([])
const loading = ref(false);
const finished = ref(false);
const message = ref('')
const show = ref(false)
const pageNum = ref(1);

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
</script>
<template>
  <div class="px-30 pt-30 text-white">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <div v-for="item in myAwardList" :key="item" :title="item" class="bg-[rgba(0,0,0,.5)] rounded p-20 mb-20">
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
  <van-dialog v-model:show="show" title="备注" show-cancel-button cancelButtonText="关闭" confirmButtonText="提交">
    <van-field
      v-model="message"
      rows="2"
      autosize
      type="textarea"
      maxlength="50"
      placeholder="请输入留言，联系方式或收获地址"
      show-word-limit
    />
  </van-dialog>
</template>