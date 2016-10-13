// 调用 shell 执行 Compass 命令
var argv = require('yargs').argv;

module.exports = function(gulp, common) {
  var _taskList = [];
  if (argv.debug) {
    _taskList.push('compass compile');
  } else {
    _taskList.push('compass compile -q');
  }

  gulp.task('compass', '编译 Compass（建议调用 watch 任务自动监控文件变化并调用）', common.plugins.shell.task(_taskList, {
    cwd: '..'
  }));
};
