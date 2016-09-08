// 读取含有工具方法的 Sass 文件列表（Sass 文件需要以 Sassdoc 格式编写注释），并将工具名称集输出为 JSON 文件
// 传入 Sass 文件列表，以及待输出的 JSON 文件地址

module.exports = function(gulp) {
  gulp.task('readToolMethod', false, function(){
    var fs = require('fs'),
        sassdoc = require('sassdoc'),
        _ = require('lodash');

    sassdoc.parse([
      './qmui/helper/mixin/'
    ], {verbose: true})
    .then(function (_data) {
      if (_data.length > 0) {
        // 按 group 把数组重新整理成二维数组
        var _result = [],
            _currentGroup = null,
            _currentGroupArray = null;
        for (var _i = 0; _i < _data.length; _i++) {
          var _item = _data[_i];
          // 由于 IE8- 下 default 为属性的保留关键字，会引起错误，因此这里要把参数中这个 default 的 key 从数据里改名
          if (_item.parameter) {
            for (var _j = 0; _j < _item.parameter.length; _j++) {
              var _paraItem = _item.parameter[_j];
              if (_paraItem.hasOwnProperty('default')) {
                _paraItem.defaultValue = _paraItem.default;
                delete _paraItem.default;
              }
            }
          }

          if (!_.isEqual(_item.group, _currentGroup)) {
            _currentGroup = _item.group;
            _currentGroupArray = []; 
            _result.push(_currentGroupArray); 
          } else {
            _currentGroupArray = _result[_result.length - 1];
          }
          _currentGroupArray.push(_item);
        }
        _result.reverse();

        // 准备把数组写入到指定文件中
        var _outputPath = '../../data/qmui_tools.json';

        // 写入文件
        fs.writeFileSync(_outputPath, 'var comments = ' + JSON.stringify(_result), 'utf8');
      }
    });
  });
};
