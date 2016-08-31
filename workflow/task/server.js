// server 监视文件改动并重新载入

module.exports = function (gulp, common) {
  gulp.task('server', function () {

    var _showLog = function () {
      if (common.config.browserSyncShowLog) {
        return 'info';
      }
      return 'silent';
    }

    common.browserSync.init({
      server: {
        // 静态路径根目录
        baseDir: common.config.htmlResultPath,
        // 设置路由
        routes: common.config.browserSyncServerRoute
      },
      logLevel: _showLog(),
      logPrefix: common.plugins.util.colors.gray(common.lib.getCurrentTime()),
      startPath: common.config.browserSyncStartPath,
      port: common.config.browserSyncPort
    });
    gulp.watch(common.config.browserSyncWatchPath).on('change', common.reload);
  });
};
