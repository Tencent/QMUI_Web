// proxy 监视文件改动并重新载入

module.exports = function (gulp, common) {
  gulp.task('proxy', function () {

    common.browserSync.init({
      open: 'external',
      proxy: common.config.browserSyncProxy,
      port: common.config.browserSyncPort,
      host: common.config.browserSyncHost,
      logLevel: !common.config.browserSyncShowLog ? 'silent' : 'info',
      logPrefix: common.plugins.util.colors.gray(common.lib.getCurrentTime()),
      startPath: common.config.browserSyncStartPath
    });
    gulp.watch(common.config.browserSyncWatchPath).on('change', common.reload);
  });
};
