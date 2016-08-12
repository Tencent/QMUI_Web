/**
 * gulpfile.js QMUI For Sass Gulp 工作流  
 *
 * @date 2015-08-14
 */

// 全局变量

// 声明插件以及配置文件的依赖
var gulp        = require('gulp-help')(require('gulp'), {
                    description: '展示这个帮助菜单',
                    hideDepsMessage: true
                  }),
    argv        = require('yargs').argv,
    path        = require('path'),
    del         = require('del'),
    pngquant    = require('imagemin-pngquant'),
    spawn       = require('child_process').spawn,
    md5         = require('js-md5'),
    plugins     = require('gulp-load-plugins')({
                    rename: {
                      'gulp-file-include': 'include',
                      'gulp-merge-link': 'merge'
                    }
                  }),
    config      = require('../config.json'),
    packageInfo = require('./package.json');

// 逻辑变量
var justAddedImage = [],
    justBeforeAddedImage = [], // 记录压缩的图片
    qmuiSupportScssFile = '../project/_qmuiSupport.scss'; // QMUI 框架需要用作功能支撑的 scss 文件

// 创建一个新项目
gulp.task('initProject', false, function(){
  /**
   * 创建一个新项目
   * 第一步：获取 Project 文件夹中的基本目录结构和公共通用组件并持有它们，但排除了主 scss 文件 demo.scss
   * 第二步：修改持有文件中的 qui_ 前缀为新项目的前缀，新前缀值从 config.json 中读取；
   * 第三步：修改持有文件内容注释中的日期为创建项目时的日期；
   * 第四步：把这些持有的文件复制到上一层目录；
   * 第五步：获取主 scss 文件 demo.scss ，并更新其中的 _qmui.scss 的引用路径（因为 demo.scss 被复制到上一层）；
   * 第六步：重命名 demo.scss，新名称从 config.json 中读取；
   * 第七步：把 demo.scss 复制到上一层目录；
   * 第八步：执行 compass 编译任务，打开浏览器，并打开新复制的 demo.html；
   */

  // 需要遍历的文件
  var _sourceArr = ['project/**/*'];
  // 额外排除 demo.scss，后面单独重命名再拷贝
  _sourceArr.push('!project/demo.scss');

  // 获取当天的日期，并统一格式为 'yyyy-mm-dd'，替换掉 demo 注释中的文件创建日期
  // gulp-replace 的正则引擎似乎对 $ 和 ^ 不支持，只能忽略开头和结尾的判断 
  var _dateRegex = /[0-9]{4}-(((0[13578]|(10|12))-(0[1-9]|[1-2][0-9]|3[0-1]))|(02-(0[1-9]|[1-2][0-9]))|((0[469]|11)-(0[1-9]|[1-2][0-9]|30)))/g,
  _currentDate = new Date(),
  _currentYear = _currentDate.getFullYear(),
  _currentMonth = checkDateFormat(_currentDate.getMonth() + 1),
  _currentDay = checkDateFormat(_currentDate.getDate()),
  _formattingDate = _currentYear + '-' + _currentMonth + '-' + _currentDay,
  _targetQmuiStylePath = '../' + path.resolve('.').split('/').pop() + '/qmui/_qmui.scss';

  // 执行创建项目的任务
  gulp.src(_sourceArr)
      .pipe(plugins.replace('qui_', config.prefix + '_'))
      .pipe(plugins.replace(_dateRegex, _formattingDate))
      .pipe(gulp.dest('../project'));

  gulp.src(['project/demo.scss'])
      .pipe(plugins.replace('../qmui/_qmui.scss', _targetQmuiStylePath))
      .pipe(plugins.replace('demo.scss', config.resultCssFileName))
      .pipe(plugins.replace(_dateRegex, _formattingDate))
      .pipe(plugins.rename(config.resultCssFileName))
      .pipe(gulp.dest('../project'));

  plugins.util.log(plugins.util.colors.green('QMUI Create Project: ') + '项目创建完毕，接下来会按 config.rb 的配置执行一次 Compass 编译')
});

// 创建一个新项目并执行一次 compass 编译
gulp.task('init', '创建一个新项目', ['initProject', 'compass']);

// 调用 shell 执行 Compass 命令
gulp.task('compass', '编译 Compass（建议调用 watch 任务自动监控文件变化并调用）', plugins.shell.task([
  'compass compile -q'
],{
  cwd: '..'
}));

// 重启 gulp
gulp.task('start', false, function(){
  if (argv.debug) {
    plugins.util.log(plugins.util.colors.green('QMUI Debug: ') + 'QMUI 进入 Debug 模式');
  }

  var _mainTaskProcess; // 记录当前 gulp 运行时的进程

  function restart() {
    if (_mainTaskProcess) {
      _mainTaskProcess.kill();
    }

    _mainTaskProcess = spawn('gulp', ['main'], {stdio: 'inherit'});
  }

  gulp.watch('package.json', function() {
      plugins.util.log('');
      plugins.util.log(plugins.util.colors.yellow('QMUI Update: ') + '检测到 QMUI Web 的 npm 包，为了避免出现错误，建议你停止目前的 gulp，请使用 npm install 命令更新后再启动 gulp');
      plugins.util.beep(10);
  });

  gulp.watch('gulpfile.js', function() {
      plugins.util.log('');
      if (argv.debug) {
        plugins.util.log(plugins.util.colors.yellow('QMUI Debug: ') + '目前为 Debug 模式，检测到 gulpfile.js 有被更新，将自动重启 gulp');
        plugins.util.beep(10);
        restart();
      } else {
        plugins.util.log(plugins.util.colors.yellow('QMUI Update: ') + '检测到 gulpfile.js 有被更新，建议你停止目前的 gulp 任务，再重新启动 gulp，以载入最新的代码。如果 npm 包也需要更新，请先更新 npm 包再重启 gulp');
        plugins.util.beep(10);
      }
  });

  // 获取第一次进入时 gulp 的进程
  _mainTaskProcess = spawn('gulp', ['main'], {stdio: 'inherit'});
});

// 清理多余文件
gulp.task('clean', '清理多余文件（清理内容在 config.json 中配置）', function() {
  // force: true 即允许 del 控制本目录以外的文件
  del(config.cleanFileType, {force: true});
  plugins.util.log(plugins.util.colors.green('QMUI Clean: ') + '清理所有的 ' + config.cleanFileType + ' 文件');
});


// 显示 QMUI Web 的版本号
gulp.task('version', '显示 QMUI Web 的版本信息', function() {
  plugins.util.log(plugins.util.colors.green(packageInfo.description + ' 的版本号: ' + packageInfo.version));
});

// 合并变更文件
gulp.task('merge', '合并变更文件', function() {
  // 读取合并规则并保存起来
  var _mergeRule = require('../mergeRule.json');

  // 合并文件
  for(var _key in _mergeRule) {
    // 后面变更文件时，需要的是每个文件在 HTML 中书写的路径，即相对模板文件的路径
    // 但对合并文件，即 concat 来说，需要的是文件相对 qmui_sass 目录的路径，因此需要对合并的结果以及来源文件手工加上一个 '../'

    var _resultFile = '../' + _key, // 合并的结果加上 '../'
        _resultFileName = path.basename(_resultFile),
        _resultFilePath = path.dirname(_resultFile),
        _value = _mergeRule[_key], // 来源文件原始路径获取
        _childFiles = [];

    // 遍历来源文件并给每个文件加上 '../'
    for(var _i = 0; _i < _value.length; _i++) {
      var _childFilesRelative = '../' + _value[_i];
      _childFiles.push(_childFilesRelative);
    }

    var _condition = function (_file) {
      if(_file.path.toString().indexOf('\.js') !== -1) {
        return true;
      } else {
        return false;
      }
    }

    gulp.src(_childFiles)
        .pipe(plugins.plumber({
          errorHandler: function(_error) {
            plugins.util.log(plugins.util.colors.red('QMUI Merge: ') + _error);
            plugins.util.beep();
          }}))
        .pipe(plugins.concat(_resultFileName))
        .pipe(plugins.if(_condition, plugins.uglify(), plugins.cleanCss({compatibility: 'ie8'})))
        .pipe(gulp.dest(_resultFilePath));
  }
  // 变更文件引用路径
  gulp.src(config.htmlResultPath + '/**/*.html')
      .pipe(plugins.merge(_mergeRule))
      .pipe(gulp.dest(config.htmlResultPath));
});

// 模板 include 命令，解释被 include 的内容并输出独立的 HTML 文件
gulp.task('include', '执行模板 include 编译（建议调用 watch 任务自动监控文件变化并调用）', function() {
  gulp.src(config.htmlSourcePath)
      .pipe(plugins.plumber({
        errorHandler: function(_error) {
          plugins.util.log(plugins.util.colors.red('QMUI Include: ') + _error);
          plugins.util.beep();
        }}))
      .pipe(plugins.include({
        prefix: config.includePrefix // 模板函数的前缀
      }))
      .pipe(gulp.dest(config.htmlResultPath)); 

  plugins.util.log(plugins.util.colors.green('QMUI Include: ') + '根据 include 标签合并后输出新文件到 ' + config.htmlResultPath);
});

// 文件监控
var watchTaskDesciption = '文件监控，自动执行基本的工作流，包括 Compass 自动编译，模板 include 自动编译，图片文件夹操作同步以及图片文件自动压缩';
gulp.task('watch', watchTaskDesciption, function () {

  plugins.util.log(plugins.util.colors.green('QMUI Watch: ') + 'QMUI 进入自动监听');

  // 监控 SASS 文件变化并自动执行 Compass 编译
  
  // Compass 下存在一个 bug：有四个 scss 文件 A，B，C，D，其中 A 和 B import C，C import D，那么当 D 修改后时重新 compile，只有 A 文件会被更新，B 不会被更新。但如果修改的是 C，那么 A 和 B 都会被更新。在 QMUI 的项目结构中，组件样式刚好命中这个 bug，因此这里做了一个处理，当组件样式被更新时，会触发修改一个空的 scss 文件然后 compile，这个文件被所有主样式文件 import，因此最终所有样式文件都得到更新。
  var _widgetStyleSourcePath = '../project/widget/',
      _compassWatch = gulp.watch(['../**/*.scss', '!' + _widgetStyleSourcePath, '!' + _widgetStyleSourcePath + '**/*'], ['compass']);
  _compassWatch.on('change', function() {
    plugins.util.log('');
    plugins.util.log(plugins.util.colors.green('QMUI Compass: ') + '进行 Compass 编译');
  });
  var _compassWidgetWatch = gulp.watch([_widgetStyleSourcePath, _widgetStyleSourcePath + '**/*']);
  _compassWidgetWatch.on('change', function() {
    gulp.src(qmuiSupportScssFile)
        .pipe(gulp.dest('../project'));
  });

  // 图片管理（图片文件夹操作同步以及图片文件自动压缩）

  // 公共部分
  var _imageMinOnSameDir = function(_dir) {
    gulp.src(_dir)
        .pipe(plugins.plumber({
          errorHandler: function(_error) {
            plugins.util.log(plugins.util.colors.red('QMUI Min Image: ') + _error);
            plugins.util.beep();
          }}))
        .pipe(plugins.imagemin({
          progressive: true,
          svgoPlugins: [{removeViewBox: false}],
          use: [pngquant()]
        }))
        .pipe(gulp.dest(path.dirname(_dir))); 
  }

  // 独立图片部分
  
  // 自动同步独立图片文件夹的操作
  var _independentImagesSourcePath = config.imagesSourcePath + config.independentImagesDirectory,
      _independentImagesResultPath = config.imagesResultPath + config.independentImagesDirectory,
      _shouldOutputEmptyLineForSyncImage;

  // 如果有需要，则在执行同步图片任务之前输出一个空行
  var _outputEmptyForSyncImageIfNeed = function() {
    if(_shouldOutputEmptyLineForSyncImage) {
      plugins.util.log('');
      _shouldOutputEmptyLineForSyncImage = false;
    }
  }

  // 压缩独立图片并同步独立图片到 public 目录
  gulp.watch([_independentImagesSourcePath, _independentImagesSourcePath + '/**/*'], function() {
    _shouldOutputEmptyLineForSyncImage = true;
    plugins.fileSync(_independentImagesSourcePath, _independentImagesResultPath, {
      ignore: '.DS_Store',
      beforeAddFileCallback: function(_fullPathSrc) {
       var _absoluteMinImageFilePath = path.resolve(_fullPathSrc),
           _absoluteMinImageFilePathMd5 = md5(_absoluteMinImageFilePath);

       if(!isElementInArray(justBeforeAddedImage, _absoluteMinImageFilePathMd5)) {
         // 这里为了避免发生“增加图片到 public/images 或修改 public/images 原有的图片，触发压缩图片，因此图片又被修改，再次触发压缩图片”的情况发生，
         // 做了一个判断，压缩一张图片时会标记下来，当再次发生图片改变时会判断这张图片是否为刚刚压缩过的图片，如果是则不执行该次压缩图片的逻辑
         // 如果不是，则说明准备处理另一张图片了，这时清空标记，进入下一张图片的处理
         justBeforeAddedImage.push(_absoluteMinImageFilePathMd5);
         _outputEmptyForSyncImageIfNeed();
         plugins.util.log(plugins.util.colors.green('QMUI Min Image: ') + '对 ' + _absoluteMinImageFilePath + ' 进行图片压缩');
         _imageMinOnSameDir(_absoluteMinImageFilePath);
       }
      },
      beforeUpdateFileCallback: function(_fullPathSrc) {
       var _absoluteMinImageFilePath = path.resolve(_fullPathSrc),
           _absoluteMinImageFilePathMd5 = md5(_absoluteMinImageFilePath);

       if(!isElementInArray(justBeforeAddedImage, _absoluteMinImageFilePathMd5)) {
         justBeforeAddedImage.push(_absoluteMinImageFilePathMd5);
         _outputEmptyForSyncImageIfNeed();
         plugins.util.log(plugins.util.colors.green('QMUI Min Image: ') + '对 ' + _absoluteMinImageFilePath + ' 进行图片压缩');
         _imageMinOnSameDir(_absoluteMinImageFilePath);
       } else {
         justBeforeAddedImage = deleteElementInArray(justBeforeAddedImage, _absoluteMinImageFilePathMd5);
       }
      },
      addFileCallback: function(_fullPathSrc, _fullPathDist) {
       var _absoluteMinImageFilePath = path.resolve(_fullPathDist),
           _absoluteMinImageFilePathMd5 = md5(_absoluteMinImageFilePath);

       if(!isElementInArray(justAddedImage, _absoluteMinImageFilePathMd5)) {
         justAddedImage.push(_absoluteMinImageFilePathMd5);
         _outputEmptyForSyncImageIfNeed();
         plugins.util.log(plugins.util.colors.green('QMUI Sync Image: ') + '同步增加文件到 ' + _absoluteMinImageFilePath);
       }
      },
      deleteFileCallback: function(_fullPathSrc, _fullPathDist) {
       _outputEmptyForSyncImageIfNeed();
       plugins.util.log(plugins.util.colors.green('QMUI Sync Image: ') + '同步删除文件 ' + path.resolve(_fullPathDist));
      },
      updateFileCallback: function(_fullPathSrc, _fullPathDist) {
       var _absoluteMinImageFilePath = path.resolve(_fullPathDist),
           _absoluteMinImageFilePathMd5 = md5(_absoluteMinImageFilePath);

       if(!isElementInArray(justAddedImage, _absoluteMinImageFilePathMd5)) {
         justAddedImage.push(_absoluteMinImageFilePathMd5);
         _outputEmptyForSyncImageIfNeed();
         plugins.util.log(plugins.util.colors.green('QMUI Sync Image: ') + '同步更新文件到 ' + _absoluteMinImageFilePath);
       } else {
         justAddedImage = deleteElementInArray(justAddedImage, _absoluteMinImageFilePathMd5);
       }
      }
    });
  });

  // Compass 图片部分（即由 Compass 支持的雪碧图部分） 

  // 监控雪碧图原图，若有修改触发 scss 修改，从而触发 Compass 重新生成雪碧图
  var _imageSpriteWatch = gulp.watch([config.imagesSourcePath + '/*/*.*', '!' + _independentImagesSourcePath, '!' + _independentImagesSourcePath + '**/*']);
  _imageSpriteWatch.on('change', function() {
    gulp.src(qmuiSupportScssFile)
        .pipe(gulp.dest('../project'));
  });

  // 压缩雪碧图
  var _minImageWatcher = gulp.watch(config.imagesResultPath + '/*.*');
  _minImageWatcher.on('change', function(event) {
    var _minImageFile = event.path,
        _minImageFilePathMd5 = md5(_minImageFile);
    // 这里为了避免发生“增加图片到 public/images 或修改 public/images 原有的图片，触发压缩图片，因此图片又被修改，再次触发压缩图片”的情况发生，
    // 做了一个判断，压缩一张图片时会标记下来，当再次发生图片改变时会判断这张图片是否为刚刚压缩过的图片，如果是则不执行该次压缩图片的逻辑
    // 如果不是，则说明准备处理另一张图片了，这时清空标记，进入下一张图片的处理
    if(event.type !== 'deleted' && !isElementInArray(justAddedImage, _minImageFilePathMd5)) {
      
      justAddedImage.push(_minImageFilePathMd5);

      plugins.util.log(plugins.util.colors.green('QMUI Min Image: ') + '对 ' + _minImageFile + ' 进行图片压缩');
      _imageMinOnSameDir(_minImageFile);

    } else if(isElementInArray(justAddedImage, _minImageFilePathMd5)) {
      justAddedImage = deleteElementInArray(justAddedImage, _minImageFilePathMd5);
    }
  });
  
  // 模板自动 include
  if(config.openIncludeFunction) {
    var _includeWatcher = gulp.watch(config.htmlSourcePath, ['include']);
    _includeWatcher.on('change', function(event) {
      plugins.util.log('');
      plugins.util.log(plugins.util.colors.green('QMUI Include: ') + '模板 ' + event.path + ' was ' + event.type);
    });
  }
 
});

// 读取含有工具方法的 Sass 文件列表（Sass 文件需要以 Sassdoc 格式编写注释），并将工具名称集输出为 JSON 文件
// 传入 Sass 文件列表，以及待输出的 JSON 文件地址
gulp.task('readToolMethod', false, function(){
	var fs = require('fs'),
      sassdoc = require('sassdoc'),
      _ = require('lodash');

  sassdoc.parse([
    './qmui/helper/mixin/'
  ], {verbose: true})
  .then(function (_data) {
    if (_data.length > 0) {
      // 按 group 把数组重新整理成二维数组
      var _result = [],
          _currentGroup = null,
          _currentGroupArray = null;
      for (var _i = 0; _i < _data.length; _i++) {
        var _item = _data[_i];
        // 由于 IE8- 下 default 为属性的保留关键字，会引起错误，因此这里要把参数中这个 default 的 key 从数据里改名
        if (_item.parameter) {
          for (var _j = 0; _j < _item.parameter.length; _j++) {
            var _paraItem = _item.parameter[_j];
            if (_paraItem.hasOwnProperty('default')) {
              _paraItem['defaultValue'] = _paraItem['default'];
              delete _paraItem['default'];
            }
          }
        }

        if (!_.isEqual(_item.group, _currentGroup)) {
          _currentGroup = _item.group;
          _currentGroupArray = []; 
          _result.push(_currentGroupArray); 
        } else {
          _currentGroupArray = _result[_result.length - 1];
        }
        _currentGroupArray.push(_item);
      }
      _result.reverse();

      // 准备把数组写入到指定文件中
      var _outputPath = '../../data/qmui_tools.json';

      // 写入文件
      fs.writeFileSync(_outputPath, 'var comments = ' + JSON.stringify(_result), 'utf8');
    }
  });
});

// 默认任务
gulp.task('default', '默认任务，自动执行一次 include 和 compass 任务，并调用 watch 任务', ['start'], function() {
  // TODO: 语法要求，有 options 必须填写 fn，所以这里弄个空函数，不优雅待优化 
}, {
  options: {
    'debug': 'debug 模式下 gulpfile.js 有变动时会自动重启 default 任务'
  }
});

gulp.task('main', false, ['include', 'compass', 'watch']);


// 工具方法
var checkDateFormat = function(_date) {
  if (_date < 10) {
    _date = '0' + _date; 
  }
  return _date; 
};

// 判断一个元素是否存在于某个数组中
var isElementInArray = function(_array, _element) {
  for(var _i = 0; _i < _array.length; _i++) {
    if(_element === _array[_i]) {
      return true;
    }
  }
  return false;
}

// 删除数组中的某个元素并返回一个新数组
var deleteElementInArray = function(_array, _element) {
  for(var _i = 0; _i < _array.length; _i++) {
    if(_element === _array[_i]) {
      return  _array.slice(0, _i).concat(_array.slice(_i + 1, _array.length));
    }
  }
}
