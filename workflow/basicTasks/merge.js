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


// 合并变更文件
const path = require('path');
const argv = require('yargs').argv;
const through = require('through2');
const minimatch = require('minimatch');

module.exports = (gulp, mix) => {

    const taskName = 'merge';

    const mergeReference = rules => {
        // 基于 https://github.com/aDaiCode/gulp-merge-link
        rules = rules || [];

        const linkRegex = /<link(?:\s+|\s+.+\s+)href\s*=\s*["']?(.+\.css).*?>/g;
        const scriptRegex = /<script(?:\s+|\s+.+\s+)src\s*=\s*["']?(.+\.js).*?script\s*>/g;

        const linkTemplate = href => {
            return '<link rel="stylesheet" href="' + href + '"/>';
        };
        const scriptTemplate = src => {
            return '<script type="text/javascript" src="' + src + '"></script>';
        };

        const getReference = (reg, contents) => {
            let result,
                references = [];
            // noinspection JSAssignmentUsedAsCondition
            while (result = reg.exec(contents)) {
                references.push({
                    match: result[0],
                    url: result[1].trim().replace(/^\.\//, '')
                });
            }
            return references;
        };

        const getTemplate = url => {
            const isScript = /\.js$/.test(url);
            if (isScript) {
                return scriptTemplate(url);
            } else {
                return linkTemplate(url);
            }
        };

        return through.obj((file, encoding, callback) => {
            if (file.isNull() || file.isStream()) {
                return callback(null, file);
            }

            let contents = String(file.contents);
            let references = [],
                replaceList = [],
                flag = {};

            // 获取所有引用
            references = references.concat(getReference(linkRegex, contents)).concat(getReference(scriptRegex, contents));

            // 循环所有引用，检测是否需要进行处理
            for (let key in references) {
                let reference = references[key];

                for (let targetUrl in rules) {
                    // 把引用与传入的合并规则进行对比，把命中规则的引用进行合并处理
                    if (!rules.hasOwnProperty(targetUrl)) {
                        break;
                    }
                    let sourceUrls = rules[targetUrl];

                    const sourceUrlFound = sourceUrls.find(sourceUrl => {
                        sourceUrl = sourceUrl.trim().replace(/^\.\//, '');

                        return minimatch(reference.url, sourceUrl);
                    });

                    if (sourceUrlFound) {
                        replaceList.push({
                            match: reference.match,
                            replace: flag[targetUrl] ? '' : getTemplate(targetUrl)
                        });

                        flag[targetUrl] = true;
                        break;
                    }
                }
            }

            if (argv.debug) {
                mix.util.log('Merge', file.path);
            }

            replaceList.map(replace => {
                contents = contents.replace(replace.match, replace.replace);
            });

            file.contents = Buffer.from(contents);

            return callback(null, file);
        });
    };

    gulp.task(taskName, done => {
        // 读取合并规则并保存起来
        let mergeRule;
        try {
            mergeRule = require('../../../qmui.merge.rule.js');
        } catch (event) {
            mix.util.error('Merge', '没有找到合并规则文件，请按照 http://qmuiteam.com/web/scaffold.html#qui_scaffoldMerge 的说明进行合并规则配置');
        }

        const replaceProjectParentDirectory = source => {
            // 转换为以项目根目录为开头的路径形式
            const projectParentDirectory = path.resolve('../../..');
            return source.replace(projectParentDirectory, '').replace(/^[\\\/]/, '');
        };

        // 合并文件
        for (let sourceFile in mergeRule) {
            // 后面变更文件时，需要的是每个文件在 HTML 中书写的路径，即相对模板文件的路径
            // 但对合并文件，即 concat 来说，需要的是文件相对 qmui_web 目录的路径，因此需要对合并的结果以及来源文件手工加上一个 '../'

            const resultFile = `../${sourceFile}`; // 合并的结果加上 '../'
            const resultFileName = path.basename(resultFile);
            const resultFilePath = path.dirname(resultFile);
            const value = mergeRule[sourceFile]; // 来源文件原始路径获取

            let childFiles = [],
                childFilesString = ''; // 用于在 Log 中显示

            // 遍历来源文件并给每个文件加上 '../'
            for (let index = 0; index < value.length; index++) {
                const childFilesRelative = `../${value[index]}`;
                childFiles.push(childFilesRelative);

                // 拼接源文件名用于 Log 中显示
                if (index === 0) {
                    childFilesString = replaceProjectParentDirectory(path.resolve(childFilesRelative));
                } else {
                    childFilesString = `${childFilesString}, ${replaceProjectParentDirectory(path.resolve(childFilesRelative))}`;
                }
            }

            const condition = file => {
                return file.path.toString().indexOf('.js') !== -1;
            };

            gulp.src(childFiles)
                .pipe(mix.plugins.plumber({
                    errorHandler: error => {
                        mix.util.error('Merge', error);
                        mix.util.beep();
                    }
                }))
                .pipe(mix.plugins.concat(resultFileName))
                .pipe(mix.plugins.if(condition, mix.plugins.uglify(), mix.plugins.cleanCss({compatibility: 'ie8'})))
                .pipe(gulp.dest(resultFilePath));

            mix.util.log('Merge', `文件 ${childFilesString} 合并压缩为 ${replaceProjectParentDirectory(path.resolve(path.join(resultFilePath, resultFileName)))}`);
        }
        // 变更文件引用路径
        gulp.src(mix.config.paths.htmlResultPath + '/**/*.html')
            .pipe(mergeReference(mergeRule))
            .pipe(mix.plugins.htmlmin({
                removeComments: true,
                collapseWhitespace: true
            }))
            .pipe(gulp.dest(mix.config.paths.htmlResultPath));
        mix.util.log('Merge', '文件合并变更已完成');

        done();
    });

    // 任务说明
    mix.addTaskDescription(taskName, '合并变更文件');
};
