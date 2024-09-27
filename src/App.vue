<script setup lang="ts">
import { reactive } from 'vue'
import VideoComponent from './components/VideoComponent.vue'

const info = reactive({
  serverIp: 'localhost',
  cameraList: [
    {
      ip: '192.168.8.245',
      username: 'admin',
      password: 'admin'
    }
  ]
})
const toggleCamera1 = () => {
  console.log('toggleCamera')
  info.cameraList = [
    {
      ip: '192.168.8.245',
      username: 'admin',
      password: 'admin'
    }
  ]
}
const toggleCamera2 = () => {
  console.log('toggleCamera')
  info.cameraList = [
    {
      ip: '192.168.8.231',
      username: 'admin',
      password: 'admin'
    }
  ]
}
</script>

<template>
  <button @click="toggleCamera1">
    切换摄像头1
  </button>
  <button @click="toggleCamera2">
    切换摄像头2
  </button>
  <VideoComponent :info="info" />
</template>
