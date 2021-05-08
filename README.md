<p align="center">
  <img src="https://raw.githubusercontent.com/QMUI/QMUIDemo_Web/master/public/style/images/independent/BannerForGithub_2x.png" width="220" alt="Banner" />
</p>

# QMUI Web [![Version Number](https://img.shields.io/npm/v/generator-qmui.svg?style=flat)](https://github.com/Tencent/QMUI_Web/ "Version Number")
> 一个旨在提高 UI 开发效率、快速产生项目 UI 的前端框架
>
> 官网：[http://qmuiteam.com/web](http://qmuiteam.com/web)
>
> 下载 Demo：[https://github.com/QMUI/QMUIDemo_Web/releases](https://github.com/QMUI/QMUIDemo_Web/releases)

[[English]](https://github.com/Tencent/QMUI_Web/tree/master/docs-translations/en-US/README.md) / [[简体中文]](https://github.com/Tencent/QMUI_Web/blob/master/README.md) / [[繁體中文]](//github.com/Tencent/QMUI_Web/tree/master/docs-translations/zh-TW/README.md)

[![Build Status](https://travis-ci.org/Tencent/QMUI_Web.svg?branch=master)](https://travis-ci.org/Tencent/QMUI_Web "Build Status")
[![Build status](https://ci.appveyor.com/api/projects/status/1h6de3rq6x45nnse?svg=true
)](https://ci.appveyor.com/project/kayo5994/qmui-web)
[![devDependencies](https://img.shields.io/david/dev/Tencent/QMUI_Web.svg?style=flat)](https://ci.appveyor.com/project/Tencent/QMUI_Web "devDependencies")
[![QMUI Team Name](https://img.shields.io/badge/Team-QMUI-brightgreen.svg?style=flat)](https://github.com/QMUI "QMUI Team")
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)](http://opensource.org/licenses/MIT "Feel free to contribute.")

QMUI Web 是一个专注 Web UI 开发，帮助开发者快速实现特定的一整套设计的框架。框架主要由一个强大的 SASS 方法合集与内置的工作流构成。通过 QMUI Web，开发者可以很轻松地提高 Web UI 开发的效率，同时保持了项目的高可维护性与稳健。如果你需要方便地控制项目的整体样式，或者需要应对频繁的界面变动，那么 QMUI Web 框架将会是你最好的解决方案。

## 功能特性

### 基础配置与组件
通过内置的公共组件和对应的 SASS 配置表，你只需修改简单的配置即可快速实现所需样式的组件。（[QMUI SASS 配置表和公共组件如何帮忙开发者快速搭建项目基础 UI？](https://github.com/Tencent/QMUI_Web/wiki/Q&A#qmui-sass-%E9%85%8D%E7%BD%AE%E8%A1%A8%E5%92%8C%E5%85%AC%E5%85%B1%E7%BB%84%E4%BB%B6%E5%A6%82%E4%BD%95%E5%B8%AE%E5%BF%99%E5%BC%80%E5%8F%91%E8%80%85%E5%BF%AB%E9%80%9F%E6%90%AD%E5%BB%BA%E9%A1%B9%E7%9B%AE%E5%9F%BA%E7%A1%80-ui)）

### SASS 增强支持
QMUI Web 包含70个 SASS mixin/function/extend，涉及布局、外观、动画、设备适配、数值计算以及 SASS 原生能力增强等多个方面，可以大幅提升开发效率。

### 完善的内置工作流
QMUI Web 内置的工作流拥有从初始化项目到变更文件的各种自动化处理，包含了模板引擎，雪碧图处理，图片集中管理与自动压缩，静态资源合并、压缩与变更以及冗余文件清理等功能。

### 扩展组件
QMUI Web 除了内置的公共组件外，还通过扩展的方式提供了常用的扩展组件，如等高左右双栏，文件上传按钮，树状选择菜单。

## 环境配置
请确保安装 [Node.js](https://nodejs.org/)（建议 10.0 或以上版本），并用以下命令全局安装 gulp：

```bash
#安装 gulp
npm install --global gulp
```

## 快速开始
推荐使用 [Yeoman](http://yeoman.io/) 脚手架 [generator-qmui](https://github.com/QMUI/generator-qmui) 安装和配置 QMUI Web。该工具可以帮助你完成 QMUI Web 的所有安装和配置。

```bash
#安装 Yeoman，如果本地已安装可以忽略
npm install -g yo
#安装 QMUI 的模板
npm install -g generator-qmui
#在项目根目录执行以下命令
yo qmui
```
<img src="https://raw.githubusercontent.com/QMUI/QMUIDemo_Web/master/public/style/images/independent/Generator.gif" width="842" alt="效果预览" />

### 完成后生成的项目目录结构
```bash
项目根目录
├─public          // 静态资源目录，由 gulp 生成
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
├─UI_html         // 静态模板目录
└─UI_html_result  // 静态模板 gulp 处理后的版本，用于前端拼接最终的模板
```

对于需要有更强定制性的开发者，请参考[创建新项目（高级）](http://qmuiteam.com/web/page/start.html#qui_createProject)

## 工作流任务列表

```bash
#在 UI_dev/qmui_web 中执行以下命令可以查看工作流的任务列表及说明
gulp list
```

也可以查看文档中的[详细说明](http://qmuiteam.com/web/page/scaffold.html)。

## 完善框架
如果有意见反馈或者功能建议，欢迎创建 [Issue](https://github.com/Tencent/QMUI_Web/issues) 或发送 [Pull Request](https://github.com/Tencent/QMUI_Web/pulls)，调试与修改框架请先阅读[文档](http://qmuiteam.com/web/page/start.html#qui_frameworkImprove)，感谢你的支持和贡献。

设计稿 Sketch 源文件可在 [Dribbble](https://dribbble.com/shots/2895907-QMUI-Logo) 上获取。

## QMUI Web Desktop

推荐配合使用的桌面 App：[QMUI Web Desktop](https://github.com/Tencent/QMUI_Web_desktop)。它可以管理基于 QMUI Web 进行开发的项目，通过 GUI 界面处理 QMUI Web 的服务开启/关闭，使框架的使用变得更加便捷，并提供了编译提醒，出错提醒，进程关闭提醒等额外的功能。

<img src="https://raw.githubusercontent.com/QMUI/QMUIDemo_Web/master/public/style/images/independent/App_2x.png" width="440" alt="QMUI Web Desktop" />
