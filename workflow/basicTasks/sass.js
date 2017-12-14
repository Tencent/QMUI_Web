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


// 进行 Sass 编译以及雪碧图处理
var argv = require('yargs').argv,
    lazysprite = require('postcss-lazysprite'),
    autoprefixer = require('autoprefixer');

module.exports = function (gulp, common) {
    var _spriteConfig = {
        cssSeparator: '_',
        imagePath: common.config.imagesSourcePath,
        stylesheetRelative: common.config.styleResultPath,
        stylesheetInput: '../project/',
        spritePath: common.config.imagesResultPath,
        smartUpdate: typeof common.config.needsLazyspriteSmartUpdate !== 'undefined' ? common.config.needsLazyspriteSmartUpdate : true,
        nameSpace: common.config.prefix + '_',
        retinaInfix: '_',
        outputExtralCSS: true
    };
    var _styleResultPath = common.config.styleResultPath;
    if (argv.debug) {
        _spriteConfig.logLevel = 'debug';
    }

    var taskName = 'sass';

    gulp.task(taskName, function () {
        var _isOpeningBrowserSyncMod = common.config.browserSyncMod !== 'close';
        return gulp.src('../project/**/*.scss')
            .pipe(common.plugins.plumber({
                errorHandler: function (_error) {
                    common.error('Sass', _error);
                    common.plugins.util.beep();
                }
            }))
            .pipe(common.plugins.if(common.config.needsSourceMaps, common.plugins.sourcemaps.init()))
            .pipe(common.plugins.if(global.isWatching && global.isHandleStyle, common.plugins.cached('sass')))
            .pipe(common.plugins.sassInheritance({base: '../project/'}))
            .pipe(common.plugins.if(Boolean(argv.debug), common.plugins.debug({title: 'Sass Debug:'})))
            .pipe(common.plugins.sass({outputStyle: 'expanded'}).on('error', common.plugins.sass.logError))
            .pipe(common.plugins.postcss([lazysprite(_spriteConfig), autoprefixer({
                flexbox: false,
                browsers: ['defaults', 'last 5 versions', '> 5% in CN', 'not ie < 8']
            })]))
            .pipe(common.plugins.if(common.config.needsSourceMaps, common.plugins.sourcemaps.write('./maps'))) // Source Maps 的 Base 输出目录为 style 输出的目录
            .pipe(gulp.dest(_styleResultPath))
            .pipe(common.plugins.if(_isOpeningBrowserSyncMod, common.reload({stream: true})));
    });

    // 任务说明
    common.tasks[taskName] = {
        description: '进行 Sass 编译以及雪碧图处理（框架自带 Watch 机制监听 Sass 和图片变化后自行编译，不建议手工调用本方法）'
    };
};
