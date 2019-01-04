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


// 模板 include 命令，解释被 include 的内容并输出独立的 HTML 文件
const path = require('path');

module.exports = (gulp, mix) => {

    const taskName = 'include';

    gulp.task(taskName, done => {

        const _condition = file => {
            const fileName = path.basename(file.path);
            return !fileName.match(/^_/);
        };

        gulp.src(mix.config.paths.htmlSourcePath)
            .pipe(mix.plugins.plumber({
                errorHandler: error => {
                    mix.util.error('Include', error);
                    mix.util.beep();
                }
            }))
            .pipe(mix.plugins.include({
                prefix: mix.config.template.includePrefix // 模板函数的前缀
            }))
            .pipe(mix.plugins.if(_condition, gulp.dest(mix.config.paths.htmlResultPath)));

        mix.util.log('Include', `根据 include 标签合并后输出新文件到 ${mix.config.paths.htmlResultPath}`);

        done();
    });

    // 任务说明
    mix.addTaskDescription(taskName, '执行模板 include 编译（建议调用 watch 任务自动监控文件变化并调用）');
};
