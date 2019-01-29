# qq-music

##### 待办
1 audio.src
2 推荐榜单以及热歌等点进去可以播放
3 拖动进度条更新播放进度

#### webpack & babel & autoprefixer-cli
##### js文件处理
  * 安装webpack 以及 babel ，参见`https://webpack.docschina.org/loaders/babel-loader/`
  ```
    npm install babel-loader@8.0.0-beta.0 @babel/core @babel/preset-env webpack webpack-cli --save-dev
  ```
  * 修改`webpack.config.js`中的entry以及output 以及给module添加rules
  * 使用`npx webpack` 则可以利用babel进行js语法转换并对js文件进行打包得到目标.js文件
##### css文件处理
  * 全局安装 node-sass 以及 autoprefixer-cli
  * 使用node-sass 将scss文件转换为css文件
  * 使用autoprefixer-cli 给css文件添加前缀
  * 对css文件进行压缩 使用`--output-style compressed`
