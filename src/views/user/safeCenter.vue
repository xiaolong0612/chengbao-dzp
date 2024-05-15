<script setup>
import { useUserStore } from "@/stores/user";

const user = useUserStore()
</script>
<template>
  <vant-header :title="$t('setting.securityCenter')" :left-arrow="true" />
  <div>
    <van-cell-group>
      <van-cell :title="$t('safeCenter.emailCheck')" is-link :value="user.info.email ? $t('setting.bound') : $t('setting.unbound')" to="/user/checkEmail" />
      <van-cell :title="$t('safeCenter.changePwd')" is-link to="/user/changePwd"/>
      <van-cell :title="$t('safeCenter.changeEmail')" is-link to="/user/changeEmail"/>
    </van-cell-group>
  </div>
</template>