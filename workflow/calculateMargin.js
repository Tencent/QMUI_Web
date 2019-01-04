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

/**
 * This file was adapted from chmontgomery's gulp-help.
 * The original file can be found at: https://github.com/chmontgomery/gulp-help/blob/master/lib/calculate-margin.js.
 *
 * @param {object} tasksObj - common.tasks
 *
 * returns:
 *  margin - length of longest basicTasks / options name
 *  hasOptions - true if any basicTasks has option(s)
 *
 * @returns {{margin: number, hasOptions: boolean}} 返回一个合适的缩进距离。
 */

module.exports = tasksObj => {
    let hasOptions = false;
    const margin = Object.keys(tasksObj).reduce((maxTaskMargin, taskName) => {
        let optionsMargin = 0;
        let opts;
        // if exists, iterate options list to calculate margin for options
        if (tasksObj[taskName] && tasksObj[taskName].options) {
            const help = tasksObj[taskName] || {options: {}};
            opts = Object.keys(help.options).sort();
            optionsMargin = opts.reduce((maxOptionMargin, opt) => {
                // if, at any time while iterating the tasks array, we also iterate an opts array, set hasOptions flag
                hasOptions = true;
                return maxOptionMargin > opt.length ? maxOptionMargin : opt.length;
            }, 0);
        }

        if (!tasksObj[taskName] || maxTaskMargin > taskName.length && maxTaskMargin > optionsMargin) {
            return maxTaskMargin;
        } else if (optionsMargin > taskName.length) {
            return optionsMargin;
        }
        return taskName.length;
    }, 0);
    return {
        margin: margin,
        hasOptions: hasOptions
    };
};
