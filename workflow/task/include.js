// 模板 include 命令，解释被 include 的内容并输出独立的 HTML 文件

var path = require('path');

module.exports = function(gulp, common) {

  gulp.task('include', '执行模板 include 编译（建议调用 watch 任务自动监控文件变化并调用）', function() {

    var _condition = function (_file) {
      var _fileName = path.basename(_file.path);
      if(_fileName.match(/^_/)) {
        return false;
      }
      return true;
    }

    gulp.src(common.config.htmlSourcePath)
        .pipe(common.plugins.plumber({
          errorHandler: function(_error) {
            common.plugins.util.log(common.plugins.util.colors.red('QMUI Include: ') + _error);
            common.plugins.util.beep();
          }}))
        .pipe(common.plugins.include({
          prefix: common.config.includePrefix // 模板函数的前缀
        }))
        .pipe(common.plugins.if(_condition, gulp.dest(common.config.htmlResultPath)));

      common.reload();
      common.plugins.util.log(common.plugins.util.colors.green('QMUI Include: ') + '根据 include 标签合并后输出新文件到 ' + common.config.htmlResultPath);
  });
};
