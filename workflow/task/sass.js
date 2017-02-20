// 调用 shell 执行 Compass 命令
var argv = require('yargs').argv;

module.exports = function(gulp, common) {
  if (argv.debug) {
  } else {
  }

  gulp.task('sass', '编译 Sass', function () {
    return gulp.src('../project/**/*.scss')
               .pipe(common.plugins.sass({outputStyle: 'compressed'}).on('error', common.plugins.sass.logError))
               .pipe(gulp.dest('../../public/style/css'));
  });
};
