<script setup>
import { useUserStore } from "@/stores/user";

const user = useUserStore()
</script>
<template>
  <vant-header :title="$t('safeCenter.emailCheck')" :left-arrow="true" />
  <div>
    <van-cell-group>
      <van-cell :title="$t('register.email')" :value="user.info.email"/>
    </van-cell-group>
  </div>
</template>