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

const fs = require('fs');
const sassdoc = require('sassdoc');
const isEqual = require('lodash/isEqual');

// 读取含有工具方法的 Sass 文件列表（Sass 文件需要以 Sassdoc 格式编写注释），并将工具名称集输出为 JS 文件
// 传入 Sass 文件列表，以及待输出的 JS 文件地址
module.exports = gulp => {

    gulp.task('readToolMethod', done => {

        sassdoc.parse('./qmui/mixin').then(data => {
            if (data.length > 0) {
                // 按 group 把数组重新整理成二维数组
                let result = [],
                    currentGroup = null,
                    currentGroupArray = null;
                for (let itemIndex = 0; itemIndex < data.length; itemIndex++) {
                    const item = data[itemIndex];
                    if (item.group.toString() !== 'abandon') {
                        // 排除已废弃的工具方法

                        // 由于 IE8- 下 default 为属性的保留关键字，会引起错误，因此这里要把参数中这个 default 的 key 从数据里改名
                        if (item.parameter) {
                            for (let parameterIndex = 0; parameterIndex < item.parameter.length; parameterIndex++) {
                                const paraItem = item.parameter[parameterIndex];
                                if (paraItem.hasOwnProperty('default')) {
                                    paraItem.defaultValue = paraItem.default;
                                    delete paraItem.default;
                                }
                            }
                        }

                        if (!isEqual(item.group, currentGroup)) {
                            currentGroup = item.group;
                            currentGroupArray = [];
                            result.push(currentGroupArray);
                        } else {
                            currentGroupArray = result[result.length - 1];
                        }
                        currentGroupArray.push(item);
                    }
                }
                result.reverse();

                // 准备把数组写入到指定文件中

                const _outputPath = '../../data/qmui_method.js';

                // 写入文件
                fs.writeFileSync(_outputPath, `var comments = ${JSON.stringify(result)};`, 'utf8');
            }
        });

        done();
    });
};
