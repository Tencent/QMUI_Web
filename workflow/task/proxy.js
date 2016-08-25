module.exports = function (gulp, common) {
    // proxy 监视文件改动并重新载入
    gulp.task('proxy', function () {
        common.browserSync.init({
            proxy: common.config.browserSyncProxy,
            port: common.config.browserSyncPort
        });
        gulp.watch(common.config.browserSyncWatchPath).on('change', common.reload);
    });
};