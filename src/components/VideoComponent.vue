<script lang="ts">
interface Camera {
  ip: string
  username: string
  password: string
  channels?: number[]
}
interface Info {
  serverIp: string
  cameraList: Camera[]
  videoWidth?: number | string
  videoHeight?: number | string
}
</script>
<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid'
import JSMpeg from '@cycjimmy/jsmpeg-player'

const props = withDefaults(defineProps<{
  info: Info
}>(), {
})
let videos = ref<{id: string,port: number}[]>([]),players = ref<any>([])
let ws:any = null
const connectWs = () => {
  ws = new WebSocket(`ws://${props.info.serverIp}:5500`)
  // ws.onopen = () => {
  //   console.log('ws open')
  // }
  ws.onclose = () => {
    // console.log('ws close')
    initPage()
  }
  ws.onmessage = event => {
    console.log('ws message',event.data)
  }
}
const initVideo = (camera: Camera) => {
  return new Promise(resolve => {
    fetch(`http://${props.info.serverIp}:5550/showVideo`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({
        ip: camera.ip,
        username: camera.username,
        password: camera.password,
        channels: camera.channels || [ 102 ]
      })
    }).then(response => response.json())
      .then(async data => {
        console.log(data)
        if(data.ports.length){
          for(let i = 0; i < data.ports.length; i++){
            videos.value.push({
              id: uuidv4(),
              port: data.ports[i]
            })
          }
        }
      }).finally(() => {
        // console.log('finally')
        resolve('complete')
      })
  })
}
const renderVideo = () => {
  videos.value.forEach((video,index) => {
    // console.log(document.getElementById(video.id))
    const player = new JSMpeg.VideoElement(document.getElementById(video.id), `ws://${props.info.serverIp}:${video.port}/`,{
      disableGl: true
    })
    players.value.push(player)
  })
}
const reset = () => {
  players.value.forEach(player => player.destroy())
  players.value = []
  videos.value = []
  if(ws)  ws.close()
  ws = null
}
const initPage = async () => {
  reset()
  for(let i = 0; i < props.info.cameraList.length; i++){
    await initVideo(props.info.cameraList[i])
  }
  // console.log('rrrr',videos.value)
  renderVideo()
  connectWs()
}
let currentFullScreenPlayer:any = null
const fullScreen = (port: number) => {
  const videoFullScreen = document.getElementById('videoFullScreen') as HTMLElement
  const close = document.getElementById('closeFullScreen') as HTMLElement
  videoFullScreen.style.display = 'block'
  close.style.display = 'block'
  currentFullScreenPlayer = new JSMpeg.VideoElement(videoFullScreen, `ws://${props.info.serverIp}:${port}/`,{
    disableGl: true
  })
}
const closeFullScreen = () => {
  const videoFullScreen = document.getElementById('videoFullScreen') as HTMLElement
  const close = document.getElementById('closeFullScreen') as HTMLElement
  videoFullScreen.style.display = 'none'
  close.style.display = 'none'
  currentFullScreenPlayer?.destroy()
  currentFullScreenPlayer = null
  
}
onMounted(() => {
  // console.log(props.info)
  if(!props.info || !props.info.serverIp || !props.info.cameraList) return
  initPage()
})
onBeforeUnmount(() => {
  reset()
})
</script>

<template>
  <div :style="{display: 'flex',flexWrap: 'wrap',justifyContent: 'space-between'}">
    <div
      v-for="video in videos"
      :key="video.id"
      class="mpeg-video"
      :style="{width: props.info.videoWidth || '100%',height: props.info.videoHeight || '500px',boxSizing: 'border-box',padding:'2px',display: 'flex',justifyContent: 'center',alignItems: 'center'}"
      @dblclick="fullScreen(video.port)"
    >
      <div
        :id="video.id"
        :style="{width: 'calc(100% - 4px)',height: 'calc(100% - 4px)'}"
      />
    </div>
  </div>
  <div
    id="videoFullScreen"
    :style="{position: 'fixed',top: 0,left: 0,width: '100%',height: '100vh',display: 'none',zIndex: 999}"
  />
  <div
    id="closeFullScreen"
    :style="{position: 'fixed',top: '10px',right: '10px',width: '30px',height: '30px',borderRadius: '50%',backgroundColor: 'rgba(0,0,0,0.5)'
             ,color: 'white',fontSize: '16px',textAlign: 'center',lineHeight: '30px',cursor: 'pointer',zIndex: 999,display: 'none'
    }"
    @click="closeFullScreen"
  >
    X
  </div>
</template>
