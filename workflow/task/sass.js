// 进行 Sass 编译以及雪碧图处理
var argv = require('yargs').argv,
    lazysprite = require('postcss-lazysprite');

module.exports = function(gulp, common) {
  var _spriteConfig = {
    cssSeparator: '_',
    imagePath: common.config.imagesSourcePath,
    stylesheetPath: common.config.styleResultPath,
    spritePath: common.config.imagesResultPath,
    smartUpdate: true,
    nameSpace: common.config.prefix + '_',
    retinaInfix: '_',
    outputExtralCSS: true
  };
  var _styleResultPath = common.config.styleResultPath;
  if (argv.debug) {
    _spriteConfig.logLevel = 'debug';
  }

  gulp.task('sass', '进行 Sass 编译以及雪碧图处理（框架自带 Watch 机制监听 Sass 和图片变化后自行编译，不建议手工调用本方法）', function () {
    var _isOpeningBrowserSyncMod = common.config.browserSyncMod !== 'close';
    return gulp.src('../project/**/*.scss')
               .pipe(common.plugins.if(common.config.needsSourceMaps, common.plugins.sourcemaps.init()))
               .pipe(common.plugins.sassInheritance({base: '../project/'}))
               .pipe(common.plugins.if(!!argv.debug, common.plugins.debug({title: 'Sass Debug:'})))
               .pipe(common.plugins.sass({outputStyle: 'expanded'}).on('error', common.plugins.sass.logError))
               .pipe(common.plugins.postcss([lazysprite(_spriteConfig)]))
               .pipe(common.plugins.if(common.config.needsSourceMaps, common.plugins.sourcemaps.write('./maps'))) // Source Maps 的 Base 输出目录为 style 输出的目录
               .pipe(gulp.dest(_styleResultPath))
               .pipe(common.plugins.if(_isOpeningBrowserSyncMod, common.reload({stream: true})));
  });
};
