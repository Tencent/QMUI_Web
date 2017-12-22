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


// 模板 include 命令，解释被 include 的内容并输出独立的 HTML 文件
var path = require('path');

module.exports = function (gulp, common) {

    var taskName = 'include';

    gulp.task(taskName, function (done) {

        var _condition = function (file) {
            var fileName = path.basename(file.path);
            return !fileName.match(/^_/);
        };

        gulp.src(common.config.paths.htmlSourcePath)
            .pipe(common.plugins.plumber({
                errorHandler: function (error) {
                    common.error('Include', error);
                    common.plugins.util.beep();
                }
            }))
            .pipe(common.plugins.include({
                prefix: common.config.template.includePrefix // 模板函数的前缀
            }))
            .pipe(common.plugins.if(_condition, gulp.dest(common.config.paths.htmlResultPath)));

        common.log('Include', '根据 include 标签合并后输出新文件到 ' + common.config.paths.htmlResultPath);

        done();
    });

    // 任务说明
    common.tasks[taskName] = {
        description: '执行模板 include 编译（建议调用 watch 任务自动监控文件变化并调用）'
    };
};
