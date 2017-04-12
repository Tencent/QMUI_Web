// 文件监控

var path     = require('path'),
    pngquant = require('imagemin-pngquant'),
    md5      = require('js-md5');

// 逻辑变量
var justAddedImage = [],
    justBeforeAddedImage = [], // 记录压缩的图片
    watchTaskDesciption = '文件监控，自动执行基本的工作流，包括 Sass 自动编译，雪碧图处理，模板 include 自动编译，图片文件夹操作同步以及图片文件自动压缩';

module.exports = function(gulp, common) {
  gulp.task('watch', watchTaskDesciption, function () {

    global.isWatching = true;

    common.log('Watch', 'QMUI 进入自动监听');

    // 图片管理（图片文件夹操作同步以及图片文件自动压缩）

    // 公共方法
    var _imageMinOnSameDir = function(_dir) {
      gulp.src(_dir)
          .pipe(common.plugins.plumber({
            errorHandler: function(_error) {
              common.error('Min Image', _error);
              common.plugins.util.beep();
            }}))
          .pipe(common.plugins.imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
          }))
          .pipe(gulp.dest(path.dirname(_dir)));
    }

    // 独立图片部分

    // 自动同步独立图片文件夹的操作
    var _independentImagesSourcePath = common.config.imagesSourcePath + common.config.independentImagesDirectory,
        _independentImagesResultPath = common.config.imagesResultPath + common.config.independentImagesDirectory,
        _shouldOutputEmptyLineForSyncImage;

    // 如果有需要，则在执行同步图片任务之前输出一个空行
    var _outputEmptyForSyncImageIfNeed = function() {
      if(_shouldOutputEmptyLineForSyncImage) {
        common.log('');
        _shouldOutputEmptyLineForSyncImage = false;
      }
    }

    // 压缩独立图片并同步独立图片到 public 目录
    gulp.watch([_independentImagesSourcePath, _independentImagesSourcePath + '/**/*'], function() {
      _shouldOutputEmptyLineForSyncImage = true;
      common.plugins.fileSync(_independentImagesSourcePath, _independentImagesResultPath, {
        ignore: ['.DS_Store', '.svn', '.git'],
        beforeAddFileCallback: function(_fullPathSrc) {
         var _absoluteMinImageFilePath = path.resolve(_fullPathSrc),
             _absoluteMinImageFilePathMd5 = md5(_absoluteMinImageFilePath);

         if (!common.lib.isElementInArray(justBeforeAddedImage, _absoluteMinImageFilePathMd5)) {
           // 这里为了避免发生“增加图片到 public/images 或修改 public/images 原有的图片，触发压缩图片，因此图片又被修改，再次触发压缩图片”的情况发生，
           // 做了一个判断，压缩一张图片时会标记下来，当再次发生图片改变时会判断这张图片是否为刚刚压缩过的图片，如果是则不执行该次压缩图片的逻辑
           // 如果不是，则说明准备处理另一张图片了，这时清空标记，进入下一张图片的处理
           justBeforeAddedImage.push(_absoluteMinImageFilePathMd5);
           _outputEmptyForSyncImageIfNeed();
           common.log('Min Image', '对 ' + _absoluteMinImageFilePath + ' 进行图片压缩');
           _imageMinOnSameDir(_absoluteMinImageFilePath);
         }
        },
        beforeUpdateFileCallback: function(_fullPathSrc) {
         var _absoluteMinImageFilePath = path.resolve(_fullPathSrc),
             _absoluteMinImageFilePathMd5 = md5(_absoluteMinImageFilePath);

         if (!common.lib.isElementInArray(justBeforeAddedImage, _absoluteMinImageFilePathMd5)) {
           justBeforeAddedImage.push(_absoluteMinImageFilePathMd5);
           _outputEmptyForSyncImageIfNeed();
           common.log('Min Image', '对 ' + _absoluteMinImageFilePath + ' 进行图片压缩');
           _imageMinOnSameDir(_absoluteMinImageFilePath);
         } else {
           justBeforeAddedImage = common.lib.deleteElementInArray(justBeforeAddedImage, _absoluteMinImageFilePathMd5);
         }
        },
        addFileCallback: function(_fullPathSrc, _fullPathDist) {
         var _absoluteMinImageFilePath = path.resolve(_fullPathDist),
             _absoluteMinImageFilePathMd5 = md5(_absoluteMinImageFilePath);

         if (!common.lib.isElementInArray(justAddedImage, _absoluteMinImageFilePathMd5)) {
           justAddedImage.push(_absoluteMinImageFilePathMd5);
           _outputEmptyForSyncImageIfNeed();
           common.log('Sync Image', '同步增加文件到 ' + _absoluteMinImageFilePath);
         }
        },
        deleteFileCallback: function(_fullPathSrc, _fullPathDist) {
         _outputEmptyForSyncImageIfNeed();
         common.log('Sync Image', '同步删除文件 ' + path.resolve(_fullPathDist));
        },
        updateFileCallback: function(_fullPathSrc, _fullPathDist) {
         var _absoluteMinImageFilePath = path.resolve(_fullPathDist),
             _absoluteMinImageFilePathMd5 = md5(_absoluteMinImageFilePath);

         if (!common.lib.isElementInArray(justAddedImage, _absoluteMinImageFilePathMd5)) {
           justAddedImage.push(_absoluteMinImageFilePathMd5);
           _outputEmptyForSyncImageIfNeed();
           common.log('Sync Image', '同步更新文件到 ' + _absoluteMinImageFilePath);
         } else {
           justAddedImage = common.lib.deleteElementInArray(justAddedImage, _absoluteMinImageFilePathMd5);
         }
        }
      });
    });

    // 雪碧图与样式处理
    // 监控雪碧图原图和样式，如果有改动，会触发样式编译以及雪碧图生成
    var _styleWatchFiles = ['../project/**/*.scss', common.config.imagesSourcePath + '/*/*.*', '!' + _independentImagesSourcePath, '!' + _independentImagesSourcePath + '**/*'];
    var _imageSpriteWatch = gulp.watch(_styleWatchFiles, ['sass']);
    _imageSpriteWatch.on('change', function() {
      common.log('');
      common.log('Sass', '进行样式编译');
    });

    // 压缩雪碧图
    var _minImageWatcher = gulp.watch(common.config.imagesResultPath + '/*.*');
    _minImageWatcher.on('change', function(event) {
      var _minImageFile = event.path,
          _minImageFilePathMd5 = md5(_minImageFile);
      // 这里为了避免发生“增加图片到 public/images 或修改 public/images 原有的图片，触发压缩图片，因此图片又被修改，再次触发压缩图片”的情况发生，
      // 做了一个判断，压缩一张图片时会标记下来，当再次发生图片改变时会判断这张图片是否为刚刚压缩过的图片，如果是则不执行该次压缩图片的逻辑
      // 如果不是，则说明准备处理另一张图片了，这时清空标记，进入下一张图片的处理
      if (event.type !== 'deleted' && !common.lib.isElementInArray(justAddedImage, _minImageFilePathMd5)) {

        justAddedImage.push(_minImageFilePathMd5);

        common.log('Min Image', '对 ' + _minImageFile + ' 进行图片压缩');
        _imageMinOnSameDir(_minImageFile);

      } else if (common.lib.isElementInArray(justAddedImage, _minImageFilePathMd5)) {
        justAddedImage = common.lib.deleteElementInArray(justAddedImage, _minImageFilePathMd5);
      }
    });

    // 模板自动 include
    if (common.config.openIncludeFunction) {
      var _includeWatcher = gulp.watch(common.config.htmlSourcePath, ['include']);
      _includeWatcher.on('change', function(event) {
        common.log('');
        common.log('Include', '模板 ' + event.path + ' was ' + event.type);
      });
    }
  });
};
