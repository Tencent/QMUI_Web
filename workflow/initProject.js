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


// 创建一个新项目
var fs = require('fs'),
    mkdirp = require('mkdirp'),
    path = require('path'),
    os = require('os');

module.exports = function (gulp, common) {

    gulp.task('initProject', function (done) {
        /**
         * 创建一个新项目
         * 第一步：获取 Project 文件夹中的基本目录结构和公共通用组件并持有它们，但排除了主 scss 文件 demo.scss
         * 第二步：修改持有文件中的 qui_ 前缀为新项目的前缀，新前缀值从 config.js 中读取；
         * 第三步：修改持有文件内容注释中的日期为创建项目时的日期；
         * 第四步：修改持有文件内容注释中的作者为执行创建项目命令的人（名称从系统账户用户名中获取）；
         * 第五步：把这些持有的文件复制到上一层目录；
         * 第六步：获取主 scss 文件 demo.scss ，并更新其中的 _qmui.scss 的引用路径（因为 demo.scss 被复制到上一层）；
         * 第七步：重命名 demo.scss，新名称从 config.js 中读取；
         * 第八步：把 demo.scss 复制到上一层目录；
         * 第九步：按配置表创建图片目录；
         * 第十步：执行 Sass 编译任务，打开浏览器，并打开新复制的 demo.html；
         */

        // 需要遍历的文件
        var sourceArr = ['project/**/*'];
        // 额外排除 demo.scss，后面单独重命名再拷贝
        sourceArr.push('!project/demo.scss');
        sourceArr.push('!project/_var.scss');

        // 获取当天的日期，并统一格式为 'yyyy-mm-dd'，替换掉 demo 注释中的文件创建日期
        // gulp-replace 的正则引擎似乎对 $ 和 ^ 不支持，只能忽略开头和结尾的判断
        var dateRegex = /[0-9]{4}-(((0[13578]|(10|12))-(0[1-9]|[1-2][0-9]|3[0-1]))|(02-(0[1-9]|[1-2][0-9]))|((0[469]|11)-(0[1-9]|[1-2][0-9]|30)))/g,
            currentDate = new Date(),
            currentYear = currentDate.getFullYear(),
            currentMonth = common.lib.checkDateFormat(currentDate.getMonth() + 1),
            currentDay = common.lib.checkDateFormat(currentDate.getDate()),
            formattingDate = currentYear + '-' + currentMonth + '-' + currentDay,
            targetQMUIStylePath = '../' + path.resolve('.').replace(/\\/g, '/').split('/').pop() + '/qmui/_qmui',
            targetQMUICalculatePath = '../' + path.resolve('.').replace(/\\/g, '/').split('/').pop() + '/qmui/mixin/tool/_calculate',
            authorName = common.lib.upperFirst(path.basename(os.homedir()));

        // 执行创建项目的任务
        gulp.src(sourceArr)
            .pipe(common.plugins.replace('qui_', common.config.prefix + '_'))
            .pipe(common.plugins.replace(dateRegex, formattingDate))
            .pipe(common.plugins.replace(/@author .*([\r\n])/, '@author ' + authorName + '$1'))
            .pipe(gulp.dest('../project'));

        gulp.src(['project/demo.scss'])
            .pipe(common.plugins.replace('../qmui/_qmui', targetQMUIStylePath))
            .pipe(common.plugins.replace('demo.scss', common.config.resultCssFileName))
            .pipe(common.plugins.replace(dateRegex, formattingDate))
            .pipe(common.plugins.replace(/@author .*([\r\n])/, '@author ' + authorName + '$1'))
            .pipe(common.plugins.rename(common.config.resultCssFileName))
            .pipe(gulp.dest('../project'));

        gulp.src(['project/_var.scss'])
            .pipe(common.plugins.replace('../qmui/mixin/tool/_calculate', targetQMUICalculatePath))
            .pipe(common.plugins.replace(dateRegex, formattingDate))
            .pipe(common.plugins.replace(/@author .*([\r\n])/, '@author ' + authorName + '$1'))
            .pipe(gulp.dest('../project'));

        // 创建公共图片目录
        if (!fs.existsSync(common.config.paths.imagesSourcePath)) {
            mkdirp(common.config.paths.imagesSourcePath);
        }

        // 创建独立图片目录
        var independentImagesSourcePath = common.config.paths.imagesSourcePath + common.config.paths.independentImagesDirectory;
        if (!fs.existsSync(independentImagesSourcePath)) {
            mkdirp(independentImagesSourcePath);
        }

        common.log('Create Project', '项目创建完毕，接下来会按配置执行一次 Default Task');

        done();
    });

    // 执行创建新项目任务
    var taskName = 'init';

    gulp.task(taskName, gulp.series('initProject', 'default'));

    // 任务说明
    common.tasks[taskName] = {
        description: '创建一个新项目'
    };
};
