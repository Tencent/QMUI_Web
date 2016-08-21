// 显示 QMUI Web 的版本号

module.exports = function(gulp, common) {
  gulp.task('version', '显示 QMUI Web 的版本信息', function() {
    common.plugins.util.log(common.plugins.util.colors.green(common.packageInfo.description + ' 的版本号: ' + common.packageInfo.version));
  });
};
