/**
 * Tencent is pleased to support the open source community by making QMUI Web available.
 * Copyright (C) 2017 THL A29 Limited, a Tencent company. All rights reserved.
 * Licensed under the MIT License (the "License"); you may not use this file except in compliance
 * with the License. You may obtain a copy of the License at
 *
 * http://opensource.org/licenses/MIT
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License is
 * distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 * either express or implied. See the License for the specific language governing permissions and
 * limitations under the License.
 */


// 声明插件以及配置文件的依赖
var plugins = require('gulp-load-plugins')({
        rename: {
            'gulp-file-include': 'include',
            'gulp-merge-link': 'merge',
            'gulp-better-sass-inheritance': 'sassInheritance'
        }
    }),
    packageInfo = require('../package.json'),
    lib = require('./lib.js'),
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload,
    _ = require('lodash'),
    argv = require('yargs').argv,
    beeper = require('beeper'),
    colors = require('ansi-colors'),
    supportsColor = require('color-support'),
    log = require('fancy-log'),
    configDefault,
    configUser = {};

// 读取项目配置表
try {
    configDefault = require('../../qmui.config.js');
} catch (event) {
    log(colors.red('QMUI Config: ') + '找不到项目配置表，请按照 http://qmuiteam.com/web/index.html 的说明进行项目配置');
}

try {
    configUser = require('../../qmui.config.user.js');
} catch (event) {
    // 没有个人用户配置，无需额外处理
}

// 创建 common 对象
var common = {};

common.plugins = plugins;
common.config = _.defaultsDeep(configUser, configDefault);
common.packageInfo = packageInfo;
common.lib = lib;
common.browserSync = browserSync;
common.reload = reload;

// 创建工具类，放置工具方法
common.util = {};

common.util.beep = beeper;
common.util.colors = colors;

// 日志方法
var addColor = function (str, type) {
    if (supportsColor() && (typeof argv.color === 'undefined' || argv.color)) {
        switch (type) {
            case 'warn':
                return common.util.colors.yellow(str);

            case 'error':
                return common.util.colors.red(str);

            case 'log':
            default:
                return common.util.colors.green(str);
        }
    } else {
        return str;
    }
};

common.util.log = function (tag, content) {
    if (arguments.length > 1) {
        log(addColor('QMUI ' + tag + ': ', 'log') + content);
    } else {
        log(arguments[0]);
    }
};

common.util.warn = function (tag, content) {
    if (arguments.length > 1) {
        log(addColor('QMUI ' + tag + ': ', 'warn') + content);
    } else {
        log(arguments[0]);
    }
};

common.util.error = function (tag, content) {
    if (arguments.length > 1) {
        log(addColor('QMUI ' + tag + ': ', 'error') + content);
    } else {
        log(arguments[0]);
    }
};

// 任务说明
common.tasks = {};

module.exports = common;
