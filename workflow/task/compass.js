// 调用 shell 执行 Compass 命令

module.exports = function(gulp, common) {
  gulp.task('compass', '编译 Compass（建议调用 watch 任务自动监控文件变化并调用）', common.plugins.shell.task([
    'compass compile -q'
  ],{
    cwd: '..'
  }));
};
