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


// 显示 QMUI Web 的版本号
module.exports = (gulp, mix) => {

    const taskName = 'version';

    gulp.task(taskName, done => {
        mix.util.log('当前项目运行的 QMUI Web 版本号: ' + mix.util.colors.green(mix.packageInfo.version));
        done();
    });

    // 任务说明
    mix.addTaskDescription(taskName, '显示 QMUI Web 的版本信息');
};
