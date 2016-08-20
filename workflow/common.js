// 声明插件以及配置文件的依赖
var plugins     = require('gulp-load-plugins')({
                    rename: {
                      'gulp-file-include': 'include',
                      'gulp-merge-link': 'merge'
                    }
                  }),
    config      = require('../../config.json'),
    packageInfo = require('../package.json'),
    lib         = require('./lib.js');

var common = {};

common.plugins = plugins;
common.config = config;
common.packageInfo = packageInfo;
common.lib = lib;

module.exports = common;
