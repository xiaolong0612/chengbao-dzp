<script setup>
</script>
<template>
  <vant-header :title="$t('setting.title')" :left-arrow="true" />
  <div>
    <van-cell-group>
      <van-cell :title="$t('setting.securityCenter')" is-link to="/user/safeCenter"/>
      <van-cell :title="$t('setting.aboutUs')" is-link to="/user/aboutUs" />
    </van-cell-group>
  </div>
</template>