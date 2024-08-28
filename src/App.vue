<script setup lang="ts">
import VideoComponent from './components/VideoComponent.vue'

const info = {
  serverIp: '192.168.8.9',
  cameraList: [
    {
      ip: '192.168.8.233',
      username: 'username',
      password: 'password'
    },
    {
      ip: '192.168.8.234',
      username: 'username',
      password: 'password'
    }
  ]
}
</script>

<template>
  <VideoComponent :info="info" />
</template>
