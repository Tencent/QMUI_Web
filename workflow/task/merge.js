// 合并变更文件

var path = require('path');

module.exports = function(gulp, common) {
  gulp.task('merge', '合并变更文件', function() {
    // 读取合并规则并保存起来
    var _mergeRule;
    try {
        _mergeRule = require('../../../mergeRule.js');
    } catch (_evnet) {
      try {
        _mergeRule = require('../../../mergeRule.json');
      } catch (_evnet) {
        common.plugins.util.log(common.plugins.util.colors.red('QMUI Merge: ') + '没有找到合并规则文件，请按照 http://qmuiteam.com/web/scaffold.html#qui_scaffoldMerge 的说明进行合并规则配置');
      }
    }

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
        if(_file.path.toString().indexOf('.js') !== -1) {
          return true;
        }
        return false;
      }

      gulp.src(_childFiles)
          .pipe(common.plugins.plumber({
            errorHandler: function(_error) {
              common.plugins.util.log(common.plugins.util.colors.red('QMUI Merge: ') + _error);
              common.plugins.util.beep();
            }}))
          .pipe(common.plugins.concat(_resultFileName))
          .pipe(common.plugins.if(_condition, common.plugins.uglify(), common.plugins.cleanCss({compatibility: 'ie8'})))
          .pipe(gulp.dest(_resultFilePath));
    }
    // 变更文件引用路径
    gulp.src(common.config.htmlResultPath + '/**/*.html')
        .pipe(common.plugins.merge(_mergeRule))
        .pipe(gulp.dest(common.config.htmlResultPath));
  });
};
