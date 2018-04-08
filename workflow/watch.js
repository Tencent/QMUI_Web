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


// 文件监控
var path = require('path'),
    pngquant = require('imagemin-pngquant'),
    md5 = require('js-md5'),
    os = require('os');

// 逻辑变量
var justAddedImage = [],
    justBeforeAddedImage = []; // 记录压缩的图片

module.exports = function (gulp, common) {

    var taskName = 'watch';

    gulp.task(taskName, function (done) {

        common.util.log('Watch', 'QMUI 进入自动监听');

        // 图片管理（图片文件夹操作同步以及图片文件自动压缩）

        // 公共方法
        var imageMinOnSameDir = function (_dir) {
            gulp.src(_dir)
                .pipe(common.plugins.plumber({
                    errorHandler: function (_error) {
                        common.util.error('Min Image', _error);
                        common.util.beep();
                    }
                }))
                .pipe(common.plugins.imagemin({
                    progressive: true,
                    svgoPlugins: [{removeViewBox: false}],
                    use: [pngquant()]
                }))
                .pipe(gulp.dest(path.dirname(_dir)));
        };

        // 独立图片部分

        // 自动同步独立图片文件夹的操作
        var independentImagesSourcePath = common.config.paths.imagesSourcePath + common.config.paths.independentImagesDirectory,
            independentImagesResultPath = common.config.paths.imagesResultPath + common.config.paths.independentImagesDirectory,
            shouldOutputEmptyLineForSyncImage;

        // 如果有需要，则在执行同步图片任务之前输出一个空行
        var outputEmptyForSyncImageIfNeed = function () {
            if (shouldOutputEmptyLineForSyncImage) {
                common.util.log('');
                shouldOutputEmptyLineForSyncImage = false;
            }
        };

        var independentImages = function (independentDone) {
            shouldOutputEmptyLineForSyncImage = true;
            common.plugins.fileSync(independentImagesSourcePath, independentImagesResultPath, {
                ignore: ['.DS_Store', '.svn', '.git'],
                beforeAddFileCallback: function (_fullPathSrc) {
                    var absoluteMinImageFilePath = path.resolve(_fullPathSrc),
                        absoluteMinImageFilePathMd5 = md5(absoluteMinImageFilePath);

                    if (!common.lib.isElementInArray(justBeforeAddedImage, absoluteMinImageFilePathMd5)) {
                        // 这里为了避免发生“增加图片到 public/images 或修改 public/images 原有的图片，触发压缩图片，因此图片又被修改，再次触发压缩图片”的情况发生，
                        // 做了一个判断，压缩一张图片时会标记下来，当再次发生图片改变时会判断这张图片是否为刚刚压缩过的图片，如果是则不执行该次压缩图片的逻辑
                        // 如果不是，则说明准备处理另一张图片了，这时清空标记，进入下一张图片的处理
                        justBeforeAddedImage.push(absoluteMinImageFilePathMd5);
                        outputEmptyForSyncImageIfNeed();
                        common.util.log('Min Image', '对 ' + absoluteMinImageFilePath + ' 进行图片压缩');
                        imageMinOnSameDir(absoluteMinImageFilePath);
                    }
                },
                beforeUpdateFileCallback: function (_fullPathSrc) {
                    var absoluteMinImageFilePath = path.resolve(_fullPathSrc),
                        absoluteMinImageFilePathMd5 = md5(absoluteMinImageFilePath);

                    if (!common.lib.isElementInArray(justBeforeAddedImage, absoluteMinImageFilePathMd5)) {
                        justBeforeAddedImage.push(absoluteMinImageFilePathMd5);
                        outputEmptyForSyncImageIfNeed();
                        common.util.log('Min Image', '对 ' + absoluteMinImageFilePath + ' 进行图片压缩');
                        imageMinOnSameDir(absoluteMinImageFilePath);
                    } else {
                        justBeforeAddedImage = common.lib.deleteElementInArray(justBeforeAddedImage, absoluteMinImageFilePathMd5);
                    }
                },
                addFileCallback: function (_fullPathSrc, _fullPathDist) {
                    var absoluteMinImageFilePath = path.resolve(_fullPathDist),
                        absoluteMinImageFilePathMd5 = md5(absoluteMinImageFilePath);

                    if (!common.lib.isElementInArray(justAddedImage, absoluteMinImageFilePathMd5)) {
                        justAddedImage.push(absoluteMinImageFilePathMd5);
                        outputEmptyForSyncImageIfNeed();
                        common.util.log('Sync Image', '同步增加文件到 ' + absoluteMinImageFilePath);
                    }
                },
                deleteFileCallback: function (_fullPathSrc, _fullPathDist) {
                    outputEmptyForSyncImageIfNeed();
                    common.util.log('Sync Image', '同步删除文件 ' + path.resolve(_fullPathDist));
                },
                updateFileCallback: function (_fullPathSrc, _fullPathDist) {
                    var absoluteMinImageFilePath = path.resolve(_fullPathDist),
                        absoluteMinImageFilePathMd5 = md5(absoluteMinImageFilePath);

                    if (!common.lib.isElementInArray(justAddedImage, absoluteMinImageFilePathMd5)) {
                        justAddedImage.push(absoluteMinImageFilePathMd5);
                        outputEmptyForSyncImageIfNeed();
                        common.util.log('Sync Image', '同步更新文件到 ' + absoluteMinImageFilePath);
                    } else {
                        justAddedImage = common.lib.deleteElementInArray(justAddedImage, absoluteMinImageFilePathMd5);
                    }
                }
            });

            independentDone();
        };

        if (common.config.needsImagesMinAndSync) {
            // 压缩独立图片并同步独立图片到 public 目录
            gulp.watch([independentImagesSourcePath, independentImagesSourcePath + '/**/*'], gulp.series(independentImages));
        }

        // 雪碧图与样式处理
        // 监控雪碧图原图和样式，如果有改动，会触发样式编译以及雪碧图生成

        // 普通雪碧图与样式监听
        var styleWatchFiles = ['../project/**/*.scss'];
        var styleWatch = gulp.watch(styleWatchFiles, gulp.series('sassWithCache', 'reload'));
        styleWatch.on('all', function () {
            common.util.log('');
            common.util.log('Sass', '进行样式编译');
        });

        var imageWatchFileSuffix = '{png, jpg, jpeg, gif, svg}';
        if (os.platform() !== 'linux' && os.platform() !== 'darwin') {
            imageWatchFileSuffix = '*';
        }
        var imageWatchFiles = [common.config.paths.imagesSourcePath + '/*/*.' + imageWatchFileSuffix, '!' + independentImagesSourcePath, '!' + independentImagesSourcePath + '**/*'];
        var imageSpriteWatch = gulp.watch(imageWatchFiles, gulp.series('sass', 'reload'));
        imageSpriteWatch.on('all', function () {
            common.util.log('');
            common.util.log('Sass', '进行样式编译');
        });

        // 压缩雪碧图
        if (common.config.needsImagesMinAndSync) {
            var minImageWatcher = gulp.watch(common.config.paths.imagesResultPath + '/*.*');
            minImageWatcher.on('all', function (event, filePath) {
                var minImageFile = filePath,
                    minImageFilePathMd5 = md5(minImageFile);
                // 这里为了避免发生“增加图片到 public/images 或修改 public/images 原有的图片，触发压缩图片，因此图片又被修改，再次触发压缩图片”的情况发生，
                // 做了一个判断，压缩一张图片时会标记下来，当再次发生图片改变时会判断这张图片是否为刚刚压缩过的图片，如果是则不执行该次压缩图片的逻辑
                // 如果不是，则说明准备处理另一张图片了，这时清空标记，进入下一张图片的处理
                if (event !== 'unlink' && !common.lib.isElementInArray(justAddedImage, minImageFilePathMd5)) {

                    justAddedImage.push(minImageFilePathMd5);

                    common.util.log('Min Image', '对 ' + minImageFile + ' 进行图片压缩');
                    imageMinOnSameDir(minImageFile);

                } else if (common.lib.isElementInArray(justAddedImage, minImageFilePathMd5)) {
                    justAddedImage = common.lib.deleteElementInArray(justAddedImage, minImageFilePathMd5);
                }
            });
        }

        // 模板自动 include
        if (common.config.template.openIncludeFunction) {
            var includeWatcher = gulp.watch(common.config.paths.htmlSourcePath, gulp.series('include'));
            includeWatcher.on('all', function (event, filePath) {
                common.util.log('');
                common.util.log('Include', 'Template ' + filePath + ' was ' + event);
            });
        }

        done();
    });

    // 任务说明
    common.tasks[taskName] = {
        description: '文件监控，自动执行基本的工作流，包括 Sass 自动编译，雪碧图处理，模板 include 自动编译，图片文件夹操作同步以及图片文件自动压缩'
    };
};
