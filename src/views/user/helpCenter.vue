<script setup>
</script>
<template>
  <vant-header :title="$t('user.help')" :left-arrow="true" />
  <div>
    <van-cell-group>
      <van-cell :title="$t('helpCenter.howToUseVip')" is-link to="/user/useVip" />
      <van-cell :title="$t('helpCenter.accountSafe')" is-link to="/user/accountSafe"/>
    </van-cell-group>
  </div>
</template>