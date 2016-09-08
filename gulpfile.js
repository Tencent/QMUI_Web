/**
 * gulpfile.js QMUI Web Gulp 工作流  
 *
 * @date 2015-08-14
 */

var gulp = require('gulp-help')(require('gulp'), {
             description: '展示这个帮助菜单',
             hideDepsMessage: true
           }),
    fs = require('fs'),
    common = require('./workflow/common.js');

// 载入任务
var taskPath = 'workflow/task';

fs.readdirSync(taskPath).filter(function (_file) {
  return _file.match(/js$/); // 排除非 JS 文件，如 Vim 临时文件
}).forEach(function (_file) {
  require('./' + taskPath + '/' + _file)(gulp, common);
});
