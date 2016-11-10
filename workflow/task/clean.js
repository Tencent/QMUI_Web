// 清理多余文件

var del = require('del');

module.exports = function(gulp, common) {
  gulp.task('clean', '清理多余文件（清理内容在 config.json 中配置）', function() {
    // force: true 即允许 del 控制本目录以外的文件
    del(common.config.cleanFileType, {force: true});
    common.log('Clean', '清理所有的 ' + common.config.cleanFileType + ' 文件');
  });
};
