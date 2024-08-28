### vue3组件(TS版本，vue版本3.2.37)
### 使用jsmpeg预览实时预览（MPEG1 / MP2）视频流
### 此组件要搭配本人开发的node服务来使用，前端是无法直接预览rtsp流的，所以要有服务端利用ffmpeg来将rtsp转换为mpeg或者flv等来供前端使用，摄像头只能是海康，尚未对接其他摄像头
#### 如何使用
1. 安装
    ```  
    yard add jsmpeg-vue-component --save
    npm install jsmpeg-vue-component --save
    ```
2. 引入  
    import { VideoComponent } from 'jsmpeg-vue-component/dist'
3. 模版中直接使用即可，但是有必传的参数  
    组件所需参数为一个对象名为info，其中  
    serveIp 必传 服务端IP  
    cameraList 必传  摄像头列表  
      --- 摄像头对象中ip，username，password必传  
      ![alt text](https://raw.githubusercontent.com/ZhangChuan01/jsmpeg-vue-component/main/demo.png)
4. 其他  
    视频画面双击可以全屏预览  
    总体字段如下  
    ##### info
    |  字段名  | 是否必传 | 类型 | 描述  |
    |  ----  |  ------  |  ----  | ----  |
    | serverIp  | 是 | string | 对应的服务端的IP，例：192.168.8.9 |
    | cameraList | 是 | camera | 摄像头列表，具体字段在下面 |
    | videoWidth | 否 | string | 单个摄像头画面的宽度，默认 ‘100%’，可传入百分比或者具体像素值如‘100px’ |
    | videoHeight | 否 | string | 单个摄像头画面的高度，默认 ‘500px’ |
    ##### camera
    |  字段名  | 是否必传 | 类型 | 描述  |
    |  ----  |  ------  |  ----  | ----  |
    | ip  | 是 | string | 摄像头IP |
    | username | 是 | camera | 摄像头用户名 |
    | password | 是 | string | 摄像头的密码 |
    | channels | 否 | string[] | 摄像头画面的通道，数组，可传多个通道，一般101代表主码流，102代表子码流，默认[ 102 ] |