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

    var taskName = 'merge';

    gulp.task(taskName, function (done) {
        // 读取合并规则并保存起来
        var mergeRule;
        try {
            mergeRule = require('../../../mergeRule.js');
        } catch (event) {
            try {
                mergeRule = require('../../../mergeRule.json');
            } catch (error) {
                common.error('Merge', '没有找到合并规则文件，请按照 http://qmuiteam.com/web/scaffold.html#qui_scaffoldMerge 的说明进行合并规则配置');
            }
        }

        var replaceProjectParentDirectory = function (source) {
            // 转换为以项目根目录为开头的路径形式
            var projectParentDirectory = path.resolve('../../..');
            return source.replace(projectParentDirectory, '').replace(/^[\\\/]/, '');
        };

        // 合并文件
        for (var sourceFile in mergeRule) {
            // 后面变更文件时，需要的是每个文件在 HTML 中书写的路径，即相对模板文件的路径
            // 但对合并文件，即 concat 来说，需要的是文件相对 qmui_web 目录的路径，因此需要对合并的结果以及来源文件手工加上一个 '../'

            var resultFile = '../' + sourceFile, // 合并的结果加上 '../'
                resultFileName = path.basename(resultFile),
                resultFilePath = path.dirname(resultFile),
                value = mergeRule[sourceFile], // 来源文件原始路径获取
                childFiles = [],
                childFilesString; // 用于在 Log 中显示

            // 遍历来源文件并给每个文件加上 '../'
            for (var index = 0; index < value.length; index++) {
                var childFilesRelative = '../' + value[index];
                childFiles.push(childFilesRelative);

                // 拼接源文件名用于 Log 中显示
                if (index === 0) {
                    childFilesString = replaceProjectParentDirectory(path.resolve(childFilesRelative));
                } else {
                    childFilesString = childFilesString + ', ' + replaceProjectParentDirectory(path.resolve(childFilesRelative));
                }
            }

            var condition = function (file) {
                return file.path.toString().indexOf('.js') !== -1;
            };

            gulp.src(childFiles)
                .pipe(common.plugins.plumber({
                    errorHandler: function (error) {
                        common.error('Merge', error);
                        common.plugins.util.beep();
                    }
                }))
                .pipe(common.plugins.concat(resultFileName))
                .pipe(common.plugins.if(condition, common.plugins.uglify(), common.plugins.cleanCss({compatibility: 'ie8'})))
                .pipe(gulp.dest(resultFilePath));

            common.log('Merge', '文件 ' + childFilesString + ' 合并压缩为 ' + replaceProjectParentDirectory(path.resolve(path.join(resultFilePath, resultFileName))));
        }
        // 变更文件引用路径
        gulp.src(common.config.paths.htmlResultPath + '/**/*.html')
            .pipe(common.plugins.merge(mergeRule))
            .pipe(gulp.dest(common.config.paths.htmlResultPath));
        common.log('Merge', '文件合并变更已完成');

        done();
    });

    // 任务说明
    common.tasks[taskName] = {
        description: '合并变更文件'
    };
};
