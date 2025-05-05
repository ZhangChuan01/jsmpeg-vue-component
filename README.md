jsmpeg-vue-component
================
### vue3组件(TS版本，vue版本3.2.37)
### 使用jsmpeg预览实时预览（MPEG1 / MP2）视频流
### 此组件要搭配[jsmpeg-node-server](https://github.com/ZhangChuan01/jsmpeg-node-server)来使用，前端是无法直接预览rtsp流的，所以要有服务端利用ffmpeg来将rtsp转换为mpeg或者flv等来供前端使用，海康摄像头可以使用channels参数的number即可，非海康如果不能展示则可以传入自定义rtsp路径字符串
#### 如何使用
1. 安装
    ```  
    yarn add jsmpeg-vue-component --save
    npm install jsmpeg-vue-component --save
    ```
2. 引入     
    单独引入    
    import { VideoComponent } from 'jsmpeg-vue-component'   
    全局注册    
    import VideoComponent from 'jsmpeg-vue-component'    
    app.use(VideoComponent)
        .mount('#app')
3. 模版中直接使用即可，但是有必传的参数  
    组件所需参数为一个对象名为info，其中  
    serveIp 非必传 服务端IP  
    cameraList 必传  摄像头列表  
      --- 摄像头对象中ip，username，password必传  
      ![alt text](https://raw.githubusercontent.com/ZhangChuan01/jsmpeg-vue-component/main/demo.png)
4. 其他  
    视频画面单击可刷新（主要用于黑屏或拉流失败之后，重新拉流）    
    视频画面双击可以全屏预览    
    双击回车重启node服务      
    总体字段如下  
    ##### info
    |  字段名  | 是否必传 | 类型 | 描述  |
    |  ----  |  ------  |  ----  | ----  |
    | serverIp  | 否 | string | 对应的服务端的IP，例：192.168.8.9，如果想通过nginx代理转发可参考下方nginx配置图片或者文件 |
    | cameraList | 是 | camera | 摄像头列表，具体字段在下面 |
    | videoWidth | 否 | string | 单个摄像头画面的宽度，默认 ‘100%’，可传入百分比或者具体像素值如‘100px’ |
    | videoHeight | 否 | string | 单个摄像头画面的高度，默认 ‘500px’ |
    ##### camera
    |  字段名  | 是否必传 | 类型 | 描述  |
    |  ----  |  ------  |  ----  | ----  |
    | ip  | 是 | string | 摄像头IP |
    | username | 是 | camera | 摄像头用户名 |
    | password | 是 | string | 摄像头的密码 |
    | channels | 否 | string/number [] | 摄像头画面的通道，数组，可传多个通道，一般101代表主码流，102代表子码流，默认[ 102 ]，可传入number类型为通道，传入字符串为自定义路径，例如[ '/Streaming/Channels/h264' ] |
    ##### nginx配置图片
    ![alt text](https://raw.githubusercontent.com/ZhangChuan01/jsmpeg-vue-component/main/nginx.png)
    ##### nginx配置文件
    [文件详情](https://github.com/ZhangChuan01/jsmpeg-vue-component/blob/main/nginx.conf)
