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

const padStart = require('lodash/padStart');

// 工具方法
class TimeFormat {
    checkDateFormat(date) {
        return padStart(date.toString(), 2, '0');
    }

    getCurrentTime() {
        const time = new Date();
        return `${this.checkDateFormat(time.getHours())}:${this.checkDateFormat(time.getMinutes())}:${this.checkDateFormat(time.getSeconds())}`;
    }
}

module.exports = TimeFormat;
