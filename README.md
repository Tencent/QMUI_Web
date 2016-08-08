<img src="https://raw.githubusercontent.com/QMUI/qmuidemo_web/master/public/style/images/independent/BannerForGithub_2x.png" alt="Banner" />

# QMUI Web [![Version Number](https://img.shields.io/npm/v/generator-qmui.svg?style=flat)](https://github.com/QMUI/qmui_web/ "Version Number")
> 一个旨在提高 UI 开发效率、快速产生项目 UI 的前端工作流
>
> 官网：[http://qmuiteam.com/web](http://qmuiteam.com/web)
>
> [Quick Start document for English](https://github.com/QMUI/qmui_web/tree/master/docs-translations/en-US)

[![devDependencies](https://img.shields.io/david/dev/QMUI/qmui_web.svg?style=flat)](https://ci.appveyor.com/project/QMUI/qmui_web "devDependencies") 
[![QMUI Team Name](https://img.shields.io/badge/Team-QMUI-brightgreen.svg?style=flat)](https://github.com/QMUI "QMUI Team") 
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)](http://opensource.org/licenses/MIT "Feel free to contribute.") 

QMUI Web 是一个专注 Web UI 开发，帮助开发者快速实现特定的一整套设计的框架。通过 QMUI Web，开发者可以很轻松地提高 Web UI 开发的效率，同时保持了项目的高可维护性与稳健。如果你的项目需要有一套完整的设计，并且可能有频繁的变动，那么 QMUI Web 框架将会是你最好的解决方案。

## 功能特性

### 基础配置与组件
* 通过预设的 SASS 配置表和公共
* 组件快速实现项目的基本样式

### SASS 与 Compass 支持
* CSS Reset
* 大量封装处理好浏览器兼容的原生 SASS 方法
* 各种数值计算和获取方法，方便约束 UI 统一
* 实现如 border 三角形等效果的各种方法
* 工具类（清除浮动，多行省略号等）

### 脚手架
* 利用 gulp 监控代替不稳定的 Compass Watch
* 模板引擎，强化 html 能力
* 图片集中管理与图片压缩
* 文件清理
* 静态资源文件合并与自动变更

### 扩展组件
* 雪碧图组件
* 等高左右双栏
* 文件上传按钮
* 树状选择菜单

## 环境配置

```
#安装 gulp
npm install --global gulp
#安装 SASS 
gem install sass
#安装 Compass
gem update --system
gem install compass
```
[为什么采用原生 SASS 和 Compass？](https://github.com/QMUI/qmui_web/wiki/Q&A#%E4%B8%BA%E4%BB%80%E4%B9%88%E9%87%87%E7%94%A8%E5%8E%9F%E7%94%9F-sass-%E5%92%8C-compass)

## 快速开始
推荐使用 [Yeoman](http://yeoman.io/) 脚手架 [generator-qmui](https://github.com/QMUI/generator-qmui) 安装和配置 QMUI Web。该工具可以帮助你完成 QMUI Web 的所有安装和配置。

```
#安装 Yeoman，如果本地已安装可以忽略
npm install -g yo
#安装 QMUI 的模板
npm install -g generator-qmui
#在项目根目录执行以下命令
yo qmui
```
<img src="https://raw.githubusercontent.com/QMUI/qmuidemo_web/master/public/style/images/independent/Generator.gif" width="628" alt="效果预览" />

### 完成后生成的项目目录结构
```
项目根目录
├─public          // 静态资源目录，由 Compass 和 gulp 生成
│  ├─js           // 静态资源 js 文件
│  └─style        // 静态资源 UI 文件
│     ├─css       // 静态资源 css 文件
│     └─images    // 静态资源 images 文件
├─UI_dev          // 实际进行开发的样式目录
│  ├─project      // 项目相关 SASS 与 images 文件，由 gulp 生成
│  │  ├─images    // 项目相关图片文件
│  │  ├─logic     // 项目相关逻辑样式
│  │  └─widget    // 项目相关公共组件样式
│  └─qmui_web     // QMUI Web 主源码应放置在这一层目录
├─UI_html         // 静态模板目录，用于 UI 工程师开发
└─UI_html_result  // 静态模板 gulp 处理后的版本，用于前端拼接最终的模板
```

对于需要有更强定制性的开发者，请参考[创建新项目（高级）](http://qmuiteam.com/web/start.html#qui_createProject)

## 其他说明
推荐配合桌面 App：[QMUI Web Desktop](http://qmuiteam.com/web/app.html)。它可以管理基于 QMUI Web 进行开发的项目，并提供了编译提醒，出错提醒，进程关闭提醒等额外的功能。

<img src="https://raw.githubusercontent.com/QMUI/qmuidemo_web/master/public/style/images/independent/App_2x.png" width="501" alt="QMUI Web Desktop" />

## 意见反馈
如果有意见反馈或者功能建议，欢迎创建 [Issue](https://github.com/QMUI/qmui_web/issues) 或发送 [Pull Request](https://github.com/QMUI/qmui_web/pulls)，感谢你的支持和贡献。
