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


// 显示 QMUI Web 的版本号
module.exports = function (gulp, common) {
    gulp.task('version', '显示 QMUI Web 的版本信息', function () {
        common.log('当前项目运行的 QMUI Web 版本号: ' + common.plugins.util.colors.green(common.packageInfo.version));
    });
};
