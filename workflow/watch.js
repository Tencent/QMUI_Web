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


// 文件监控
const path = require('path');
const pngquant = require('imagemin-pngquant');
const md5 = require('js-md5');

// 逻辑变量
let justAddedImage = [],
    justBeforeAddedImage = []; // 记录压缩的图片

module.exports = (gulp, mix) => {

    const taskName = 'watch';

    gulp.task(taskName, (done) => {

        mix.util.log('Watch', 'QMUI 进入自动监听');

        // 图片管理（图片文件夹操作同步以及图片文件自动压缩）

        // 公共方法
        const imageMinOnSameDir = (dir) => {
            gulp.src(dir)
                .pipe(mix.plugins.plumber({
                    errorHandler: (error) => {
                        mix.util.error('Min Image', error);
                        mix.util.beep();
                    }
                }))
                .pipe(mix.plugins.imagemin({
                    progressive: true,
                    svgoPlugins: [{removeViewBox: false}],
                    use: [pngquant()]
                }))
                .pipe(gulp.dest(path.dirname(dir)));
        };

        // 独立图片部分

        // 自动同步独立图片文件夹的操作
        const independentImagesSourcePath = mix.config.paths.imagesSourcePath + mix.config.paths.independentImagesDirectory;
        const independentImagesResultPath = mix.config.paths.imagesResultPath + mix.config.paths.independentImagesDirectory;
        let shouldOutputEmptyLineForSyncImage;

        // 如果有需要，则在执行同步图片任务之前输出一个空行
        const outputEmptyForSyncImageIfNeed = () => {
            if (shouldOutputEmptyLineForSyncImage) {
                mix.util.log('');
                shouldOutputEmptyLineForSyncImage = false;
            }
        };

        const independentImages = (independentDone) => {
            shouldOutputEmptyLineForSyncImage = true;
            mix.plugins.fileSync(independentImagesSourcePath, independentImagesResultPath, {
                ignore: ['.DS_Store', '.svn', '.git'],
                beforeAddFileCallback (_fullPathSrc) {
                    const absoluteMinImageFilePath = path.resolve(_fullPathSrc);
                    const absoluteMinImageFilePathMd5 = md5(absoluteMinImageFilePath);

                    if (!justBeforeAddedImage.includes(absoluteMinImageFilePathMd5)) {
                        // 这里为了避免发生“增加图片到 public/images 或修改 public/images 原有的图片，触发压缩图片，因此图片又被修改，再次触发压缩图片”的情况发生，
                        // 做了一个判断，压缩一张图片时会标记下来，当再次发生图片改变时会判断这张图片是否为刚刚压缩过的图片，如果是则不执行该次压缩图片的逻辑
                        // 如果不是，则说明准备处理另一张图片了，这时清空标记，进入下一张图片的处理
                        justBeforeAddedImage.push(absoluteMinImageFilePathMd5);
                        outputEmptyForSyncImageIfNeed();
                        mix.util.log('Min Image', `对 ${absoluteMinImageFilePath} 进行图片压缩`);
                        imageMinOnSameDir(absoluteMinImageFilePath);
                    }
                },
                beforeUpdateFileCallback (_fullPathSrc) {
                    const absoluteMinImageFilePath = path.resolve(_fullPathSrc);
                    const absoluteMinImageFilePathMd5 = md5(absoluteMinImageFilePath);

                    if (!justBeforeAddedImage.includes(absoluteMinImageFilePathMd5)) {
                        justBeforeAddedImage.push(absoluteMinImageFilePathMd5);
                        outputEmptyForSyncImageIfNeed();
                        mix.util.log('Min Image', `对 ${absoluteMinImageFilePath} 进行图片压缩`);
                        imageMinOnSameDir(absoluteMinImageFilePath);
                    } else {
                        justBeforeAddedImage = justBeforeAddedImage.filter((item) => item !== absoluteMinImageFilePathMd5);
                    }
                },
                addFileCallback (_fullPathSrc, _fullPathDist) {
                    const absoluteMinImageFilePath = path.resolve(_fullPathDist);
                    const absoluteMinImageFilePathMd5 = md5(absoluteMinImageFilePath);

                    if (!justAddedImage.includes(absoluteMinImageFilePathMd5)) {
                        justAddedImage.push(absoluteMinImageFilePathMd5);
                        outputEmptyForSyncImageIfNeed();
                        mix.util.log('Sync Image', `同步增加文件到 ${absoluteMinImageFilePath}`);
                    }
                },
                deleteFileCallback (_fullPathSrc, _fullPathDist) {
                    outputEmptyForSyncImageIfNeed();
                    mix.util.log('Sync Image', `同步删除文件 ${path.resolve(_fullPathDist)}`);
                },
                updateFileCallback (_fullPathSrc, _fullPathDist) {
                    const absoluteMinImageFilePath = path.resolve(_fullPathDist);
                    const absoluteMinImageFilePathMd5 = md5(absoluteMinImageFilePath);

                    if (!justAddedImage.includes(absoluteMinImageFilePathMd5)) {
                        justAddedImage.push(absoluteMinImageFilePathMd5);
                        outputEmptyForSyncImageIfNeed();
                        mix.util.log('Sync Image', `同步更新文件到 ${absoluteMinImageFilePath}`);
                    } else {
                        justAddedImage = justAddedImage.filter((item) => item !== absoluteMinImageFilePathMd5);
                    }
                }
            });

            independentDone();
        };

        if (mix.config.needsImagesMinAndSync) {
            // 压缩独立图片并同步独立图片到 public 目录
            gulp.watch([independentImagesSourcePath, `${independentImagesSourcePath}/**/*`], gulp.series(independentImages));
        }

        // 雪碧图与样式处理
        // 监控雪碧图原图和样式，如果有改动，会触发样式编译以及雪碧图生成

        // 普通雪碧图与样式监听
        const styleWatchFiles = ['../project/**/*.scss'];
        const styleWatchTasks = ['sassWithCache'];
        if (mix.config.browserSync.browserSyncMod === 'server' || mix.config.browserSync.browserSyncMod === 'proxy') {
            styleWatchTasks.push('reload');
        }
        const styleWatch = gulp.watch(styleWatchFiles, gulp.series(styleWatchTasks));
        styleWatch.on('all', () => {
            mix.util.log('');
            mix.util.log('Sass', '进行样式编译');
        });

        const imageWatchFiles = [`${mix.config.paths.imagesSourcePath}/*/*.*`, `!${independentImagesSourcePath}`, `!${independentImagesSourcePath}**/*`];
        const imageSpriteTasks = ['sass'];
        if (mix.config.browserSync.browserSyncMod === 'server' || mix.config.browserSync.browserSyncMod === 'proxy') {
            imageSpriteTasks.push('reload');
        }
        const imageSpriteWatch = gulp.watch(imageWatchFiles, gulp.series(imageSpriteTasks));
        imageSpriteWatch.on('all', () => {
            mix.util.log('');
            mix.util.log('Sass', '进行样式编译');
        });

        // 压缩雪碧图
        if (mix.config.needsImagesMinAndSync) {
            const minImageWatcher = gulp.watch(mix.config.paths.imagesResultPath + '/*.*');
            minImageWatcher.on('all', (event, filePath) => {
                const minImageFile = filePath;
                const minImageFilePathMd5 = md5(minImageFile);
                // 这里为了避免发生“增加图片到 public/images 或修改 public/images 原有的图片，触发压缩图片，因此图片又被修改，再次触发压缩图片”的情况发生，
                // 做了一个判断，压缩一张图片时会标记下来，当再次发生图片改变时会判断这张图片是否为刚刚压缩过的图片，如果是则不执行该次压缩图片的逻辑
                // 如果不是，则说明准备处理另一张图片了，这时清空标记，进入下一张图片的处理
                if (event !== 'unlink' && !justAddedImage.includes(minImageFilePathMd5)) {

                    justAddedImage.push(minImageFilePathMd5);

                    mix.util.log('Min Image', `对 ${minImageFile} 进行图片压缩`);
                    imageMinOnSameDir(minImageFile);

                } else if (justAddedImage.includes(minImageFilePathMd5)) {
                    justAddedImage = justAddedImage.filter((item) => item !== minImageFilePathMd5);
                }
            });
        }

        // 模板自动 include
        if (mix.config.template.openIncludeFunction) {
            const includeWatcher = gulp.watch(mix.config.paths.htmlSourcePath, gulp.series('include'));
            includeWatcher.on('all', (event, filePath) => {
                mix.util.log('');
                mix.util.log('Include', 'Template ' + filePath + ' was ' + event);
            });
        }

        done();
    });

    // 任务说明
    mix.addTaskDescription(taskName, '文件监控，自动执行基本的工作流，包括 Sass 自动编译，雪碧图处理，模板 include 自动编译，图片文件夹操作同步以及图片文件自动压缩');
};
