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
    var spriteConfig = {
        cssSeparator: '_',
        imagePath: common.config.paths.imagesSourcePath,
        stylesheetRelative: common.config.paths.styleResultPath,
        stylesheetInput: '../project/',
        spritePath: common.config.paths.imagesResultPath,
        smartUpdate: typeof common.config.needsLazyspriteSmartUpdate !== 'undefined' ? common.config.needsLazyspriteSmartUpdate : true,
        nameSpace: common.config.prefix + '_',
        retinaInfix: '_',
        outputExtralCSS: true
    };
    var styleResultPath = common.config.paths.styleResultPath;
    if (argv.debug) {
        spriteConfig.logLevel = 'debug';
    }

    var sassTaskName = 'sass';
    var sassWithCacheTaskName = 'sassWithCache';

    gulp.task(sassWithCacheTaskName, function () {
        return gulp.src('../project/**/*.scss', {since: gulp.lastRun(sassWithCacheTaskName)})
            .pipe(common.plugins.plumber({
                errorHandler: function (_error) {
                    common.util.error('Sass', _error);
                    common.util.beep();
                }
            }))
            .pipe(common.plugins.if(common.config.needsSourceMaps, common.plugins.sourcemaps.init()))
            .pipe(common.plugins.sassInheritance({base: '../project/'}))
            .pipe(common.plugins.if(Boolean(argv.debug), common.plugins.debug({title: 'Sass Debug:'})))
            .pipe(common.plugins.sass({
                errLogToConsole: true,
                outputStyle: 'expanded'
            }).on('error', common.plugins.sass.logError))
            .pipe(common.plugins.postcss([lazysprite(spriteConfig), autoprefixer({
                flexbox: false,
                browsers: ['defaults', 'last 5 versions', '> 5% in CN', 'not ie < 8']
            })]))
            .pipe(common.plugins.if(common.config.needsSourceMaps, common.plugins.sourcemaps.write('./maps'))) // Source Maps 的 Base 输出目录为 style 输出的目录
            .pipe(gulp.dest(styleResultPath));
    });

    gulp.task(sassTaskName, function () {
        return gulp.src('../project/**/*.scss')
            .pipe(common.plugins.plumber({
                errorHandler: function (_error) {
                    common.util.error('Sass', _error);
                    common.util.beep();
                }
            }))
            .pipe(common.plugins.if(common.config.needsSourceMaps, common.plugins.sourcemaps.init()))
            .pipe(common.plugins.sassInheritance({base: '../project/'}))
            .pipe(common.plugins.if(Boolean(argv.debug), common.plugins.debug({title: 'Sass Debug:'})))
            .pipe(common.plugins.sass({
                errLogToConsole: true,
                outputStyle: 'expanded'
            }).on('error', common.plugins.sass.logError))
            .pipe(common.plugins.postcss([lazysprite(spriteConfig), autoprefixer({
                flexbox: false,
                browsers: ['defaults', 'last 5 versions', '> 5% in CN', 'not ie < 8']
            })]))
            .pipe(common.plugins.if(common.config.needsSourceMaps, common.plugins.sourcemaps.write('./maps'))) // Source Maps 的 Base 输出目录为 style 输出的目录
            .pipe(gulp.dest(styleResultPath));
    });

    // 任务说明
    common.tasks[sassTaskName] = {
        description: '进行 Sass 编译以及雪碧图处理（框架自带 Watch 机制监听 Sass 和图片变化后自行编译，不建议手工调用本方法）'
    };
};
