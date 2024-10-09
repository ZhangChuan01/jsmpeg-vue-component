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
interface LoadCamera {
  id: string
  port: number
  ip: string
  channel: number
  username: string
  password: string
}
</script>
<script setup lang="ts">
import { v4 as uuidv4 } from 'uuid'
import JSMpeg from '@cycjimmy/jsmpeg-player'

const props = withDefaults(defineProps<{
  info: Info
}>(), {
})
let videos = ref<LoadCamera[]>([]),players = ref<any>([])
let ws:any = null
const connectWs = () => {
  ws = new WebSocket(`ws://${props.info.serverIp}:5500`)
  ws.onopen = () => {
    console.log('ws open')
    initPage()
  }
  ws.onclose = () => {
    // console.log('ws close')
    reset()
    connectWs()
  }
  ws.onmessage = event => {
    console.log('ws message',event.data)
  }
}
const initVideo = (camera: Camera) => {
  return new Promise(resolve => {
    fetch(`http://${props.info.serverIp}:5550/showVideo/init`,{
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
        // console.log(data)
        if(data.ports.length){
          for(let i = 0; i < data.ports.length; i++){
            videos.value.push({
              id: uuidv4(),
              port: data.ports[i],
              ip: camera.ip,
              channel: camera.channels && camera.channels[i] || 102,
              username: camera.username,
              password: camera.password
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
  console.log('renderVideo',videos.value)
  videos.value.forEach((video,index) => {
    // console.log(document.getElementById(video.id))
    const player = new JSMpeg.VideoElement(document.getElementById(video.id), `ws://${props.info.serverIp}:${video.port}/`,{
      disableGl: true
    })
    players.value.push(player)
  })
  console.log('players',players.value)
}
const refreshSignalVideo = (camera: LoadCamera,index:number) => {
  fetch(`http://${props.info.serverIp}:5550/showVideo/init`,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      ip: camera.ip,
      username: camera.username,
      password: camera.password,
      channels: [ camera.channel ]
    })
  }).then(response => response.json())
    .then(async data => {
      // console.log(data)
      if(data.ports.length){
        const newVideo = {
          id: uuidv4(),
          port: data.ports[0],
          ip: camera.ip,
          channel: camera.channel,
          username: camera.username,
          password: camera.password
        }
        videos.value.splice(index,1,newVideo)
        console.log('videos',videos.value)
        await nextTick()
        const player = new JSMpeg.VideoElement(document.getElementById(newVideo.id), `ws://${props.info.serverIp}:${newVideo.port}/`,{
          disableGl: true
        })
        players.value.splice(index,1,player)
        console.log('videos22222',players)
      }
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
  // reset()
  console.log('initPage',props.info,videos.value)
  for(let i = 0; i < props.info.cameraList.length; i++){
    await initVideo(props.info.cameraList[i])
  }
  // console.log('rrrr',videos.value)
  renderVideo()
  // connectWs()
}
watch(() => props.info, () => {
  if(ws){
    reset()
  }else{
    connectWs()
  }
  // console.log('watch',props.info)
},{ deep: true })
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
let clickTime = 0
document.addEventListener('keydown', e => {
  console.log('e.key',e.key,clickTime)
  if(e.key === 'Enter'){
    if(clickTime === 0){
      clickTime = new Date().getTime()
      setTimeout(() => {
        clickTime = 0
      }, 1000)
    }else if(clickTime + 1000 > new Date().getTime()){
      console.log('restart')
      clickTime = 0
      fetch(`http://${props.info.serverIp}:5550/showVideo/restart`)
    }
  }
  console.log('e',e)
})
onMounted(() => {
  // console.log(props.info)
  if(!props.info || !props.info.serverIp || !props.info.cameraList) return
  connectWs()
})
onBeforeUnmount(() => {
  reset()
})
</script>

<template>
  <div
    :style="{position: 'relative',display: 'flex',flexWrap: 'wrap',justifyContent: 'space-between',width: '100%',height: '100%',
             backgroundColor: videos.length ? 'white' : '#f5f5f5'}"
  >
    <div
      v-for="(video,index) in videos"
      :key="video.id"
      class="mpeg-video"
      title="刷新视频"
      :style="{width: props.info.videoWidth || '100%',height: props.info.videoHeight || '500px',boxSizing: 'border-box',padding:'2px',display: 'flex',justifyContent: 'center',
               alignItems: 'center',cursor: 'pointer'}"
      @click="refreshSignalVideo(video,index)"
      @dblclick="fullScreen(video.port)"
    >
      <div
        :id="video.id"
        :style="{width: 'calc(100% - 4px)',height: 'calc(100% - 4px)'}"
      />
    </div>
    <div
      v-if="!videos.length"
      :style="{position: 'absolute',top: '50%',left: '50%',transform: 'translate(-50%,-50%)'}"
    >
      视频加载中...
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
