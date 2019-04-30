/**
 * Tencent is pleased to support the open source community by making QMUI Web available.
 * Copyright (C) 2019 THL A29 Limited, a Tencent company. All rights reserved.
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
const argv = require('yargs').argv;
const lazysprite = require('postcss-lazysprite');
const svgSprite = require('postcss-svg-sprite');
const autoprefixer = require('autoprefixer');

module.exports = (gulp, mix) => {
    const lazySpriteConfig = {
        cssSeparator: '_',
        imagePath: mix.config.paths.imagesSourcePath,
        stylesheetRelative: mix.config.paths.styleResultPath,
        stylesheetInput: '../project/',
        spritePath: mix.config.paths.imagesResultPath,
        smartUpdate: typeof mix.config.needsLazyspriteSmartUpdate !== 'undefined' ? mix.config.needsLazyspriteSmartUpdate : true,
        nameSpace: `${mix.config.prefix}_`,
        retinaInfix: '_',
        outputExtralCSS: true
    };
    const svgSpriteConfig = {
        imagePath: mix.config.paths.imagesSourcePath,
        spriteOutput: mix.config.paths.imagesResultPath,
        styleOutput: mix.config.paths.styleResultPath,
        nameSpace: `${mix.config.prefix}_`
    };
    const styleResultPath = mix.config.paths.styleResultPath;
    if (argv.debug) {
        lazySpriteConfig.logLevel = 'debug';
    }

    const sassTaskName = 'sass';
    const sassWithCacheTaskName = 'sassWithCache';

    const sassOptionWithCache = () => ({since: gulp.lastRun(sassWithCacheTaskName)});

    const sassHandle = (options) => {
        options = options || (() => ({}));
        return () =>
            gulp.src('../project/**/*.scss', options())
                .pipe(mix.plugins.sassInheritance({base: '../project/'}))
                .pipe(mix.plugins.if(Boolean(argv.debug), mix.plugins.debug({title: 'Sass Debug:'})))
                .pipe(mix.plugins.if(mix.config.needsSourceMaps, mix.plugins.sourcemaps.init()))
                .pipe(mix.plugins.sass({
                    errLogToConsole: true,
                    indentWidth: 4,
                    precision: 6,
                    outputStyle: 'expanded'
                }).on('error', mix.plugins.sass.logError))
                .pipe(mix.plugins.postcss([lazysprite(lazySpriteConfig), svgSprite(svgSpriteConfig), autoprefixer({
                    browsers: ['defaults', 'last 5 versions', '> 5% in CN', 'not ie <= 8', 'iOS > 8']
                })]))
                .pipe(mix.plugins.if(mix.config.needsSourceMaps, mix.plugins.sourcemaps.write('./maps'))) // Source Maps 的 Base 输出目录为 style 输出的目录
                .pipe(gulp.dest(styleResultPath))
    };

    gulp.task(sassWithCacheTaskName, sassHandle(sassOptionWithCache));

    gulp.task(sassTaskName, sassHandle());

    // 任务说明
    mix.addTaskDescription(sassTaskName, '进行 Sass 编译以及雪碧图处理（框架自带 Watch 机制监听 Sass 和图片变化后自行编译，不建议手工调用本方法）');
};
