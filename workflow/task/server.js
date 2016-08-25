module.exports = function (gulp, common) {
    // server 监视文件改动并重新载入
    gulp.task('server', function () {
        common.browserSync.init({
            server: {
                // 静态路径根目录
                baseDir: common.config.htmlResultPath,
                // 设置路由
                routes: common.config.browserSyncRoute
            },
            startPath: common.config.browserSyncStartPath,
            port: common.config.browserSyncPort
        });
        gulp.watch(common.config.browserSyncWatchPath).on('change', common.reload);
    });
};