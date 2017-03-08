// Gulp 服务入口
var argv  = require('yargs').argv,
    spawn = require('child_process').spawn,
    os    = require('os');

module.exports = function(gulp, common) {

  if (os.platform() === 'linux' || os.platform() === 'darwin') {

    gulp.task('start', false, function(){
      if (argv.debug) {
        common.log('Debug: ', 'QMUI 进入 Debug 模式');
      }

      var _mainTaskProcess; // 记录当前 gulp 运行时的进程

      function restart() {
        if (_mainTaskProcess) {
          _mainTaskProcess.kill();
        }

        _mainTaskProcess = spawn('gulp', ['main'], {stdio: 'inherit'});
      }

      gulp.watch('package.json', function() {
          common.log('');
          common.warn('Update', '检测到 QMUI Web 的 npm 包，为了避免出现错误，建议你停止目前的 gulp，请使用 npm install 命令更新后再启动 gulp');
          common.plugins.util.beep(10);
      });

      gulp.watch(['gulpfile.js', 'workflow', 'workflow/**/*'], function() {
          common.log('');
          if (argv.debug) {
            common.warn('Debug', '目前为 Debug 模式，检测到工作流源码有被更新，将自动重启 gulp');
            common.plugins.util.beep(10);
            restart();
          } else {
            common.warn('Update', '检测到工作流源码有被更新，建议你停止目前的 gulp 任务，再重新启动 gulp，以载入最新的代码。如果 npm 包也需要更新，请先更新 npm 包再重启 gulp');
            common.plugins.util.beep(10);
          }
      });

      // 获取第一次进入时 gulp 的进程
      if (argv.debug) {
        _mainTaskProcess = spawn('gulp', ['main', '--debug'], {stdio: 'inherit'});
      } else {
        _mainTaskProcess = spawn('gulp', ['main'], {stdio: 'inherit'});
      }
    });

    // 默认任务
    gulp.task('default', '默认任务，自动执行一次 include 和 sass 任务，并调用 watch 任务', ['start'], function() {
      // TODO: 语法要求，有 options 必须填写 fn，所以这里弄个空函数，不优雅待优化
    }, {
      options: {
        'debug': 'debug 模式下 gulpfile.js 有变动时会自动重启 default 任务'
      }
    });
  } else {
    gulp.task('default', '默认任务，自动执行一次 include 和 sass 任务，并调用 watch 任务', ['main']);
  }

  if (common.config.browserSyncMod === 'server' || common.config.browserSyncMod === 'proxy') {
    gulp.task('main', false, common.plugins.sequence('include', 'sass', 'watch', common.config.browserSyncMod));
  } else if (common.config.browserSyncMod === 'close') {
    gulp.task('main', false, common.plugins.sequence('include', 'sass', 'watch'));
  } else {
    gulp.task('main', false, function() {
      common.error('Config', 'Config 中的 browserSyncMod 仅支持 ', common.plugins.util.colors.yellow('server'), ', ', common.plugins.util.colors.yellow('proxy'), ', ', common.plugins.util.colors.yellow('close'), ' 三个值');
    });
  }
};
