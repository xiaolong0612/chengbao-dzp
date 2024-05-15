<script setup>
</script>

<template>
  <van-config-provider theme="dark">
    <div :style="{backgroundImage: 'url('+$getAssetsFile('images/bg.jpg')+')', backgroundSize: 'auto 100%', backgroundPosition: 'right'}" class="min-h-screen">
      <RouterView />
    </div>
  </van-config-provider>
  <!-- <router-view v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" v-if="$route.meta.keepAlive" :key="$route.meta.title"></component>
    </keep-alive>
    <component :is="Component" v-if="!$route.meta.keepAlive" :key="$route.meta.title"></component>
  </router-view> -->
</template>

<style>
::-webkit-scrollbar {
  display: none;
}
</style>
