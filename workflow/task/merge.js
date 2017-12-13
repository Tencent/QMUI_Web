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


// 合并变更文件
var path = require('path');

module.exports = function (gulp, common) {
    gulp.task('merge', '合并变更文件', function () {
        // 读取合并规则并保存起来
        var _mergeRule;
        try {
            _mergeRule = require('../../../mergeRule.js');
        } catch (_evnet) {
            try {
                _mergeRule = require('../../../mergeRule.json');
            } catch (_e) {
                common.error('Merge', '没有找到合并规则文件，请按照 http://qmuiteam.com/web/scaffold.html#qui_scaffoldMerge 的说明进行合并规则配置');
            }
        }

        var _replaceProjectParentDirectory = function (_source) {
            // 转换为以项目根目录为开头的路径形式
            var _projectParentDirectory = path.resolve('../../..');
            return _source.replace(_projectParentDirectory, '').replace(/^[\\\/]/, '');
        }

        // 合并文件
        for (var _key in _mergeRule) {
            // 后面变更文件时，需要的是每个文件在 HTML 中书写的路径，即相对模板文件的路径
            // 但对合并文件，即 concat 来说，需要的是文件相对 qmui_web 目录的路径，因此需要对合并的结果以及来源文件手工加上一个 '../'

            var _resultFile = '../' + _key, // 合并的结果加上 '../'
                _resultFileName = path.basename(_resultFile),
                _resultFilePath = path.dirname(_resultFile),
                _value = _mergeRule[_key], // 来源文件原始路径获取
                _childFiles = [],
                _childFilesString; // 用于在 Log 中显示

            // 遍历来源文件并给每个文件加上 '../'
            for (var _i = 0; _i < _value.length; _i++) {
                var _childFilesRelative = '../' + _value[_i];
                _childFiles.push(_childFilesRelative);

                // 拼接源文件名用于 Log 中显示
                if (_i === 0) {
                    _childFilesString = _replaceProjectParentDirectory(path.resolve(_childFilesRelative));
                } else {
                    _childFilesString = _childFilesString + ', ' + _replaceProjectParentDirectory(path.resolve(_childFilesRelative));
                }
            }

            var _condition = function (_file) {
                if (_file.path.toString().indexOf('.js') !== -1) {
                    return true;
                }
                return false;
            }

            gulp.src(_childFiles)
                .pipe(common.plugins.plumber({
                    errorHandler: function (_error) {
                        common.error('Merge', _error);
                        common.plugins.util.beep();
                    }
                }))
                .pipe(common.plugins.concat(_resultFileName))
                .pipe(common.plugins.if(_condition, common.plugins.uglify(), common.plugins.cleanCss({compatibility: 'ie8'})))
                .pipe(gulp.dest(_resultFilePath));

            common.log('Merge', '文件 ' + _childFilesString + ' 合并压缩为 ' + _replaceProjectParentDirectory(path.resolve(path.join(_resultFilePath, _resultFileName))));
        }
        // 变更文件引用路径
        gulp.src(common.config.htmlResultPath + '/**/*.html')
            .pipe(common.plugins.merge(_mergeRule))
            .pipe(gulp.dest(common.config.htmlResultPath));
        common.log('Merge', '文件合并变更已完成');
    });
};
