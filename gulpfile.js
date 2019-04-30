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


// gulpfile.js QMUI Web Gulp 工作流
const gulp = require('gulp');
const fs = require('fs');
const mix = new (require('./workflow/Mix.js'))();

// 载入基础任务
const basicTaskPath = 'workflow/basicTasks';
const combinedTaskPath = 'workflow';

const basicTaskPathFilterCallback = (file) => file.match(/js$/); // 排除非 JS 文件，如 Vim 临时文件

fs.readdirSync(basicTaskPath).filter(basicTaskPathFilterCallback).sort().forEach((file) => {
    require('./' + basicTaskPath + '/' + file)(gulp, mix);
});

// 载入复合任务

// 载入 watch 任务
require('./' + combinedTaskPath + '/watch')(gulp, mix);

// 载入自定义任务
if (mix.config.customTasks) {
    Object.keys(mix.config.customTasks).forEach((customTaskName) => {
        require('./' + mix.config.customTasks[customTaskName])(gulp, mix);
    });
}

// 载入 start 和 initProject 任务
['start', 'initProject'].forEach((file) => {
    require('./' + combinedTaskPath + '/' + file)(gulp, mix);
});
