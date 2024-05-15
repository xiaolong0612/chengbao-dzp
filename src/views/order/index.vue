<script setup>
import { createApp, ref } from 'vue';

const list = ref([
  {
    name: '龙卡',
    price: '100',
    createDate: '2024-12-12 12:12',
    remark: ''
  }
]);
const loading = ref(false);
const finished = ref(false);
const message = ref('')
const show = ref(true)
</script>
<template>
  <div class="px-30 pt-100 text-white">
    <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <div v-for="item in list" :key="item" :title="item" class="bg-[rgba(0,0,0,.5)] rounded p-20">
        <div class="flex justify-between items-center">
          <div class="text-left">
            <div>
              {{ item.name }}
            </div>
            <div class="text-xs text-gray-300">
              领取时间：{{ item.createDate }}
            </div>
          </div>
          <div>
            <van-button class="bg-transparent" type="primary" round block plain hairline size="mini" @click="show = true">查看详情</van-button>
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