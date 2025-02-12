import { App } from 'vue'
import VideoComponent from './components/VideoComponent.vue'

declare module 'vue' {
  export interface GlobalComponents {
    VideoComponent: typeof VideoComponent
  }
}

export { VideoComponent }

export default {
  install: (app: App) => {
    app.component('VideoComponent', VideoComponent)
  }
}
