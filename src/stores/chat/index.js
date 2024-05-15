import { defineStore } from 'pinia'
import { useUserStore } from "../user/index.js";
const user = useUserStore()

export const useChatStore = defineStore('CHAT', {
	state:() => ({
		websock: null,
    websocketUrl: 'wss://chat.lgoo-shop.top',
    uid: '',
    lockReconnect: false, // 是否真正建立连接
    timeout: 50 * 1000, // 58秒一次心跳
    timeoutObj: null, // 心跳心跳倒计时
    serverTimeoutObj: null, // 心跳倒计时
    timeoutnum: null, // 断开 重连倒计时,
    msgList: []
	}),
	// computed
	getters: {

	},
	// methods
	actions: {
		initWebSocket () {
      // 初始化weosocket
      const wsuri = this.websocketUrl
      this.websock = new WebSocket(wsuri)
      // 客户端接收服务端数据时触发
      this.websock.onmessage = this.websocketonmessage
      // 连接建立时触发
      this.websock.onopen = this.websocketonopen
      // 通信发生错误时触发
      this.websock.onerror = this.websocketonerror
      // 连接关闭时触发
      this.websock.onclose = this.websocketclose
    },
    websocketonopen () {
      if (this.websock.readyState === 1) {
        console.log('连接正常')
        // 如果连接正常
        this.websocketsend({
          type: 'bind',
          msg: ''
        })
      }
      // 开启心跳
      this.start()
    },
    // 通信发生错误时触发
    websocketonerror () {
      console.log('出现错误')
      this.reconnect()
    },
    // 客户端接收服务端数据时触发
    websocketonmessage (e) {
      console.log('收到消息')
      console.log(e.data)
      const data = JSON.parse(e.data)
      if(data.type == 'notice'){
        this.msgList.push(data)
      }
      // // 收到服务器信息，心跳重置
      // WS.reset()
    },
    websocketsend (Data) {
      // 数据发送
      this.websock.send(JSON.stringify({
        type: Data.type,
        uid: user.info.id || '',
        msg: Data.msg
      }))
    },
    // 连接关闭时触发
    websocketclose (e) {
      // 关闭
      console.log('断开连接', e)
      // 重连
      this.reconnect()
    },
    reconnect () {
      // 重新连接
      const that = this
      if (that.lockReconnect) {
        return
      }
      that.lockReconnect = true
      // 没连接上会一直重连，设置延迟避免请求过多
      that.timeoutnum && clearTimeout(that.timeoutnum)
      that.timeoutnum = setTimeout(function () {
        // 新连接
        that.initWebSocket()
        that.lockReconnect = false
      }, 5000)
    },
    start(){
      // 开启心跳
      console.log('开启心跳')
      const self = this
      self.timeoutObj && clearTimeout(self.timeoutObj)
      self.serverTimeoutObj && clearTimeout(self.serverTimeoutObj)
      self.timeoutObj = setTimeout(function () {
        // 这里发送一个心跳，后端收到后，返回一个心跳消息，
        if (self.websock.readyState === 1) {
          // 如果连接正常
          self.websock.send({
            type: 'bind',
            uid: user.info.id || '',
            msg: '心跳'
          }) // 这里可以自己跟后端约定
        } else {
          // 否则重连
          self.reconnect()
        }
        self.serverTimeoutObj = setTimeout(function () {
          // 超时关闭
          self.websock.close()
        }, self.timeout)
      }, self.timeout)
    },
		reset () {
      // 重置心跳
      // 清除时间
      clearTimeout(this.timeoutObj)
      clearTimeout(this.serverTimeoutObj)
      // 重启心跳
      this.start()
    },
	},
	persist: false
})