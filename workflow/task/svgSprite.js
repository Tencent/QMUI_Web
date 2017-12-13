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

var svgSprite = require('gulp-qmui-svg-sprite');
var filter = require('gulp-filter');

module.exports = function (gulp, common) {

    var svgFilter = filter('**/*.svg', {restore: true});
    var scssFilter = filter('**/*.scss');

    var _spriteConfig = {
        stylesheet: {
            bust: false,
            type: 'scss',
            compile: false,
            fileSuffix: '',
            dest: '',
            classNamePrefix: common.config.prefix,
            classNameSeparator: '_'
        },
        svg: {
            fileSuffix: '',
            dest: ''
        },
        template: {
            path: 'svgTemplate.tpl',
            variables: {}
        }
    };

    gulp.task('svgSprite', function () {
        return gulp.src(common.config.imagesSourcePath + '/**/*.svg')
            .pipe(svgSprite(_spriteConfig))
            .pipe(svgFilter)
            .pipe(gulp.dest(common.config.imagesResultPath))
            .pipe(svgFilter.restore)
            .pipe(scssFilter)
            .pipe(gulp.dest(common.config.svgResultPath))
    });
};
