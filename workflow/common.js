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
    configDefault,
    configUser = {};

// 读取项目配置表
try {
    configDefault = require('../../config.js');
} catch (_event) {
    try {
        configDefault = require('../../config.json');
    } catch (_e) {
        plugins.util.log(plugins.util.colors.red('QMUI Config: ') + '找不到项目配置表，请按照 http://qmuiteam.com/web/index.html 的说明进行项目配置');
    }
}

try {
    configUser = require('../../config.user.js');
} catch (_e) {
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

// 日志方法
common.log = function (_tag, _content) {
    if (arguments.length > 1) {
        plugins.util.log(common.plugins.util.colors.green('QMUI ' + _tag + ': ') + _content);
    } else {
        plugins.util.log(arguments[0]);
    }
};
common.warn = function (_tag, _content) {
    if (arguments.length > 1) {
        plugins.util.log(common.plugins.util.colors.yellow('QMUI ' + _tag + ': ') + _content);
    } else {
        plugins.util.log(arguments[0]);
    }
};
common.error = function (_tag, _content) {
    if (arguments.length > 1) {
        plugins.util.log(common.plugins.util.colors.red('QMUI ' + _tag + ': ') + _content);
    } else {
        plugins.util.log(arguments[0]);
    }
};

module.exports = common;
