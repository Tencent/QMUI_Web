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

const beeper = require('beeper');
const colors = require('ansi-colors');
const fancyLog = require('fancy-log');
const argv = require('yargs').argv;
const supportsColor = require('color-support');

/**
 * 创建工具类，放置工具方法。
 */
class Util {
    constructor() {
        this.beep = beeper;
        this.colors = colors;
    }


    addColor(str, type) {
        if (supportsColor() && (typeof argv.color === 'undefined' || argv.color)) {
            if (type === 'warn') {
                return this.colors.yellow(str);
            } else if (type === 'error') {
                return this.colors.red(str);
            } else if (type === 'info') {
                return this.colors.gray(str);
            }
            return this.colors.green(str);
        }
        return str;
    }

    log(tag, content) {
        if (arguments.length > 1) {
            fancyLog(this.addColor(`QMUI ${tag}: `, 'log') + content);
        } else {
            fancyLog(arguments[0]);
        }
    }

    warn(tag, content) {
        if (arguments.length > 1) {
            fancyLog(this.addColor(`QMUI ${tag}: `, 'warn') + content);
        } else {
            fancyLog(arguments[0]);
        }
    }

    error(tag, content) {
        if (arguments.length > 1) {
            fancyLog(this.addColor(`QMUI ${tag}: `, 'error') + content);
        } else {
            fancyLog(arguments[0]);
        }
    }
}

module.exports = Util;
