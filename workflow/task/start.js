// Gulp 服务入口
var argv  = require('yargs').argv,
    spawn = require('child_process').spawn;

module.exports = function(gulp, common) {
  gulp.task('start', false, function(){
    if (argv.debug) {
      common.plugins.util.log(common.plugins.util.colors.green('QMUI Debug: ') + 'QMUI 进入 Debug 模式');
    }

    var _mainTaskProcess; // 记录当前 gulp 运行时的进程

    function restart() {
      if (_mainTaskProcess) {
        _mainTaskProcess.kill();
      }

      _mainTaskProcess = spawn('gulp', ['main'], {stdio: 'inherit'});
    }

    gulp.watch('package.json', function() {
        common.plugins.util.log('');
        common.plugins.util.log(common.plugins.util.colors.yellow('QMUI Update: ') + '检测到 QMUI Web 的 npm 包，为了避免出现错误，建议你停止目前的 gulp，请使用 npm install 命令更新后再启动 gulp');
        common.plugins.util.beep(10);
    });

    gulp.watch('gulpfile.js', function() {
        common.plugins.util.log('');
        if (argv.debug) {
          common.plugins.util.log(common.plugins.util.colors.yellow('QMUI Debug: ') + '目前为 Debug 模式，检测到 gulpfile.js 有被更新，将自动重启 gulp');
          common.plugins.util.beep(10);
          restart();
        } else {
          common.plugins.util.log(common.plugins.util.colors.yellow('QMUI Update: ') + '检测到 gulpfile.js 有被更新，建议你停止目前的 gulp 任务，再重新启动 gulp，以载入最新的代码。如果 npm 包也需要更新，请先更新 npm 包再重启 gulp');
          common.plugins.util.beep(10);
        }
    });

    // 获取第一次进入时 gulp 的进程
    _mainTaskProcess = spawn('gulp', ['main'], {stdio: 'inherit'});
  });

  // 默认任务
  gulp.task('default', '默认任务，自动执行一次 include 和 compass 任务，并调用 watch 任务', ['start', common.config.browserSyncMod], function() {
    // TODO: 语法要求，有 options 必须填写 fn，所以这里弄个空函数，不优雅待优化 
  }, {
    options: {
      'debug': 'debug 模式下 gulpfile.js 有变动时会自动重启 default 任务'
    }
  });

  gulp.task('main', false, ['include', 'compass', 'watch']);
};
