import { App } from 'vue'
import VideoComponent from './components/VideoComponent.vue'

export default {
  install: (app: App) => {
    app.component('VideoComponent', VideoComponent)
  }
}

export { VideoComponent }