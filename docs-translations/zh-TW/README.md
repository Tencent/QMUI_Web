<p align="center">
  <img src="https://raw.githubusercontent.com/QMUI/QMUIDemo_Web/master/public/style/images/independent/BannerForGithub_2x.png" width="220" alt="Banner" />
</p>

# QMUI Web [![Version Number](https://img.shields.io/npm/v/generator-qmui.svg?style=flat)](https://github.com/Tencent/QMUI_Web/ "Version Number")
> 一個旨在提高 UI 開發效率、快速產生項目 UI 的前端框架
>
> 官網：[http://qmuiteam.com/web](http://qmuiteam.com/web)
>
> 下載 Demo：[https://github.com/QMUI/QMUIDemo_Web/releases](https://github.com/QMUI/QMUIDemo_Web/releases)

[[English]](https://github.com/Tencent/QMUI_Web/tree/master/docs-translations/en-US/README.md) / [[简体中文]](https://github.com/Tencent/QMUI_Web/blob/master/README.md) / [[繁體中文]](//github.com/Tencent/QMUI_Web/tree/master/docs-translations/zh-TW/README.md)

[![Build Status](https://travis-ci.org/Tencent/QMUI_Web.svg?branch=master)](https://travis-ci.org/Tencent/QMUI_Web "Build Status")
[![Build status](https://ci.appveyor.com/api/projects/status/1h6de3rq6x45nnse?svg=true
)](https://ci.appveyor.com/project/kayo5994/qmui-web)
[![devDependencies](https://img.shields.io/david/dev/Tencent/QMUI_Web.svg?style=flat)](https://ci.appveyor.com/project/Tencent/QMUI_Web "devDependencies")
[![QMUI Team Name](https://img.shields.io/badge/Team-QMUI-brightgreen.svg?style=flat)](https://github.com/QMUI "QMUI Team")
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)](http://opensource.org/licenses/MIT "Feel free to contribute.")

QMUI Web 是一個專註 Web UI 開發，幫助開發者快速實現特定的一整套設計的框架。框架主要由一個強大的 SASS 方法合集與內置的工作流構成。通過 QMUI Web，開發者可以很輕松地提高 Web UI 開發的效率，同時保持了項目的高可維護性與穩健。如果你需要方便地控制項目的整體樣式，或者需要應對頻繁的界面變動，那麽 QMUI Web 框架將會是你最好的解決方案。

## 功能特性

### 基礎配置與組件
通過內置的公共組件和對應的 SASS 配置表，你只需修改簡單的配置即可快速實現所需樣式的組件。（[QMUI SASS 配置表和公共組件如何幫忙開發者快速搭建項目基礎 UI？](https://github.com/Tencent/QMUI_Web/wiki/Q&A#qmui-sass-%E9%85%8D%E7%BD%AE%E8%A1%A8%E5%92%8C%E5%85%AC%E5%85%B1%E7%BB%84%E4%BB%B6%E5%A6%82%E4%BD%95%E5%B8%AE%E5%BF%99%E5%BC%80%E5%8F%91%E8%80%85%E5%BF%AB%E9%80%9F%E6%90%AD%E5%BB%BA%E9%A1%B9%E7%9B%AE%E5%9F%BA%E7%A1%80-ui)）

### SASS 增強與支援
QMUI Web 包含70個 SASS mixin/function/extend，涉及布局、外觀、動畫、設備適配、數值計算以及 SASS 原生能力增強等多個方面，可以大幅提升開發效率。

### 腳手架（自動化任務執行工具）
QMUI Web 內置的工作流擁有從初始化項目到變更文件的各種自動化處理，包含了模板引擎，雪碧圖處理，圖片集中管理與自動壓縮，靜態資源合並、壓縮與變更以及冗余文件清理等功能。

### 擴展組件
QMUI Web 除了內置的公共組件外，還通過擴展的方式提供了常用的擴展組件，如等高左右雙欄，文件上傳按鈕，樹狀選擇菜單。

## 環境配置
请确保安装 [Node.js](https://nodejs.org/)（推薦 8.0 或以上版本），并用以下命令把 gulp 安装到全域环境：

```bash
#安裝 gulp
npm install --global gulp
```
## 快速開始
推薦使用 [Yeoman](http://yeoman.io/) 腳手架 [generator-qmui](https://github.com/QMUI/generator-qmui) 安裝和配置 QMUI Web。該工具可以幫助你完成 QMUI Web 的所有安裝和配置。

```bash
#安裝 Yeoman，如果本地已安裝可以忽略
npm install -g yo
#安裝 QMUI 的模板
npm install -g generator-qmui
#在項目根目錄執行以下命令
yo qmui
```
<img src="https://raw.githubusercontent.com/QMUI/QMUIDemo_Web/master/public/style/images/independent/Generator.gif" width="628" alt="效果預覽" />

### 完成後生成的項目目錄結構
```bash
项目根目录
├─public          // 靜態資源目錄，由 gulp 生成
│  ├─js           // 靜態資源 js 文件
│  └─style        // 靜態資源 UI 文件
│     ├─css       // 靜態資源 css 文件
│     └─images    // 靜態資源 images 文件
├─UI_dev          // 實際進行開發的樣式目錄
│  ├─project      // 項目相關 SASS 與 images 文件，由 gulp 生成
│  │  ├─images    // 項目相關圖片文件
│  │  ├─logic     // 項目相關邏輯樣式
│  │  └─widget    // 項目相關公共組件樣式
│  └─qmui_web     // QMUI Web 主源碼應放置在這一層目錄
├─UI_html         // 靜態模板目錄
└─UI_html_result  // 靜態模板 gulp 處理後的版本，用於前端拼接最終的模板
```

對於需要有更強定制性的開發者，請參考[創建新項目（進階）](http://qmuiteam.com/web/page/start.html#qui_createProject)

## 工作流任務列表

```bash
#在 UI_dev/qmui_web 中執行以下命令可以查看工作流的任務列表及說明
gulp list
```

也可以查看文檔中的[詳細說明](http://qmuiteam.com/web/page/scaffold.html)。

## 完善框架
如果有意見反饋或者功能建議，歡迎創建 [Issue](https://github.com/Tencent/QMUI_Web/issues) 或發送 [Pull Request](https://github.com/Tencent/QMUI_Web/pulls)，調試與修改框架請先閱讀[文檔](http://qmuiteam.com/web/page/start.html#qui_frameworkImprove)，感謝你的支持和貢獻。

設計稿 Sketch 源文件可在 [Dribbble](https://dribbble.com/shots/2895907-QMUI-Logo) 上獲取。

## QMUI Web Desktop

推薦配合使用的桌機應用程式：[QMUI Web Desktop](https://github.com/Tencent/QMUI_Web_desktop)。它可以管理基於 QMUI Web 進行開發的項目，通過 GUI 界面處理 QMUI Web 的服務開啟/關閉，使框架的使用變得更加便捷，並提供了編譯提醒，出錯提醒，進程關閉提醒等額外的功能。

<img src="https://raw.githubusercontent.com/QMUI/QMUIDemo_Web/master/public/style/images/independent/App_2x.png" width="440" alt="QMUI Web Desktop" />
