// 声明插件以及配置文件的依赖
var plugins     = require('gulp-load-plugins')({
                    rename: {
                      'gulp-file-include': 'include',
                      'gulp-merge-link': 'merge'
                    }
                  }),
    packageInfo = require('../package.json'),
    lib         = require('./lib.js'),
    browserSync = require('browser-sync').create(),
    reload      = browserSync.reload,
    config;

// 读取项目配置表
try {
  config = require('../../config.js');
} catch (_event) {
  try {
    config = require('../../config.json');
  } catch (_e) {
    plugins.util.log(plugins.util.colors.red('QMUI Config: ') + '找不到项目配置表，请按照 http://qmuiteam.com/web/index.html 的说明进行项目配置');

  }
}

// 创建 common 对象
var common = {};

common.plugins = plugins;
common.config = config;
common.packageInfo = packageInfo;
common.lib = lib;
common.browserSync = browserSync;
common.reload = reload;

module.exports = common;
