<template>
  <van-nav-bar class="my-header" :title="title" :left-arrow="leftArrow" :fixed="fixed" :border="border" placeholder safe-area-inset-top @click-left="onClickLeft">
    <template #left v-if="leftCustom">
      <slot name="leftCustom" />
    </template>
    <template #right v-if="rightCustom">
      <slot name="rightCustom" />
      <Lang v-if="rightLang" />
    </template>
  </van-nav-bar>
</template>
<script setup>
import { useRouter } from 'vue-router'
import Lang from "./Lang.vue";
const router = useRouter()
defineProps({
  title: {
    type: String,
    default: ''
  },
  leftArrow: {
    type: Boolean,
    default: true
  },
  fixed: {
    type: Boolean,
    default: true
  },
  border: {
    type: Boolean,
    default: true
  },
  leftCustom: {
    type: Boolean,
    default: false
  },
  rightCustom: {
    type: Boolean,
    default: false
  },
  rightLang: {
    type: Boolean,
    default: false
  }
})
const onClickLeft = () => {
  router.back()
}
</script>
<style scoped lang="scss">
.my-header{
  :deep(.van-nav-bar__left){
    .van-icon{
      color: #999;
      font-size: 18px;
    }
  }
}
</style>
