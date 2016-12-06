// 显示 QMUI Web 的版本号

module.exports = function(gulp, common) {
  gulp.task('version', '显示 QMUI Web 的版本信息', function() {
    common.log('当前项目运行的 QMUI Web 版本号: ' + common.plugins.util.colors.green(common.packageInfo.version));
  });
};
