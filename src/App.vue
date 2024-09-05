<script setup lang="ts">
import { reactive } from 'vue'
import VideoComponent from './components/VideoComponent.vue'

const info = reactive({
  serverIp: '192.168.8.12',
  cameraList: [
    {
      ip: '192.168.8.233',
      username: 'username',
      password: 'password'
    }
  ]
})

</script>

<template>
  <VideoComponent :info="info" />
</template>
