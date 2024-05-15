<script setup>
import { ref } from 'vue';

const list = ref([{
  name: 'Coinbase',
  link: 'https://www.coinbase.com'
}, {
  name: 'Moonpay',
  link: 'https://buy.moonpay.com'
}, {
  name: 'localbitcoins',
  link: 'https://localbitcoins.com'
}, {
  name: 'Huobi OTC',
  link: 'https://www.huobi.com/zh-cn/fiat-crypto/trade/buy-usdt'
}, {
  name: 'Binance',
  link: 'https://www.binance.com/en'
}, {
  name: 'BitoEX',
  link: 'https://www.bitoex.com'
}, {
  name: 'Shakepay',
  link: 'https://shakepay.com'
}])
</script>
<template>
  <vant-header :title="$t('user.buycoin')" :left-arrow="true" />
  <div>
    <van-cell-group>
      <van-cell v-for="item in list" :key="item.name" :title="item.name + $t('user.buy') +'USDT'" is-link :url="item.link"/>
    </van-cell-group>
  </div>
</template>