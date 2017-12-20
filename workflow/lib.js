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

// 工具方法
var lib = {};

lib.checkDateFormat = function (date) {
    if (date < 10) {
        date = '0' + date;
    }
    return date;
};

lib.getCurrentTime = function () {
    var time = new Date(),
        timeResult = lib.checkDateFormat(time.getHours()) + ':' + lib.checkDateFormat(time.getMinutes()) + ':' + lib.checkDateFormat(time.getSeconds());
    return timeResult;
};

// 判断一个元素是否存在于某个数组中
lib.isElementInArray = function (array, element) {
    for (var _i = 0; _i < array.length; _i++) {
        if (element === array[_i]) {
            return true;
        }
    }
    return false;
}

// 删除数组中的某个元素并返回一个新数组
lib.deleteElementInArray = function (array, element) {
    for (var _i = 0; _i < array.length; _i++) {
        if (element === array[_i]) {
            return array.slice(0, _i).concat(array.slice(_i + 1, array.length));
        }
    }
}

// 使字符串的第一个字符大写
lib.upperFirst = function (data) {
    return data.substring(0, 1).toUpperCase() + data.substring(1);
}

module.exports = lib;
