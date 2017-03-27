module.exports = {
  /**
   * 项目相关部分代码，复制后应首先进行这些配置
   *
   */
  "project": "Demo",
  "prefix": "dm",
  "resultCssFileName": "main.scss",
  "cleanFileType": ["../.sass-cache", "../.sass-cache/**/*"],
  "needsSourceMaps": false,
  // 是否需要监听雪碧图变化，如果为 false，则在雪碧图发生变化时不会触发雪碧图重新生成
  "needsWatchingCssSprite": true,

  /**
   * 项目的路径配置，建议尽量使用推荐的路径，若要修改，请保持与 config.rb 中的指向的目录保持一致，但需要注意因为相对位置不同（这里是以 qmui_web 目录为 Base Path），所以这里的值应该比 config.rb 中的多了一个 ../
   *
   */
  "htmlSourcePath": ["../../UI_html/**/*.html"],
  "imagesSourcePath": "../project/images",
  "htmlResultPath": "../../UI_html_result",
  "imagesResultPath": "../../public/style/images",
  "independentImagesDirectory": "/independent",
  "styleResultPath": "../../public/style/css",

  /**
   * BrowerSync 设置
   *
   */
  // browserSync 的模式，本地模式、代理模式或者关闭(server/proxy/close)
  "browserSyncMod": "server",
  // 自定义端口
  "browserSyncPort": 3030,
  // 是否显示 BrowserSync 的日志
  "browserSyncShowLog": false,
  // server 开启后的默认路径
  "browserSyncStartPath": "/web",
  "browserSyncHost": "",
  "browserSyncWatchPath": ["../../UI_html_result/*.html", "../../public/**/*"],
  // 自定义路由，server 模式下方可产生作用
  "browserSyncServerRoute": {
      "/public": "../../public",
      "/web": "../../UI_html_result"
  },
  // 自定义代理源地址，proxy 模式下方可产生作用
  "browserSyncProxy": "",

  /**
   * 模板 include 引擎
   *
   */
  "openIncludeFunction": true,
  "includePrefix": "@@"
};
