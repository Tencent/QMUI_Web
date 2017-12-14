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

module.exports = function (tasksObj) {
    var hasOptions = false;
    var margin = Object.keys(tasksObj).reduce(function (_maxTaskMargin, _taskName) {
        var _optionsMargin = 0,
            _opts;
        // if exists, iterate options list to calculate margin for options
        if (tasksObj[_taskName] && tasksObj[_taskName].options) {
            var _help = tasksObj[_taskName] || {options: {}};
            _opts = Object.keys(_help.options).sort();
            _optionsMargin = _opts.reduce(function (_maxOptionMargin, _opt) {
                // if, at any time while iterating the tasks array, we also iterate an opts array, set hasOptions flag
                hasOptions = true;
                return _maxOptionMargin > _opt.length ? _maxOptionMargin : _opt.length;
            }, 0);
        }

        if (!tasksObj[_taskName] || _maxTaskMargin > _taskName.length && _maxTaskMargin > _optionsMargin) {
            return _maxTaskMargin;
        } else if (_optionsMargin > _taskName.length) {
            return _optionsMargin;
        }
        return _taskName.length;
    }, 0);
    return {
        margin: margin,
        hasOptions: hasOptions
    };
};
