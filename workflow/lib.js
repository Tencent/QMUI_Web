// 工具方法

var lib = {};

lib.checkDateFormat = function(_date) {
  if (_date < 10) {
    _date = '0' + _date;
  }
  return _date;
};

lib.getCurrentTime = function(){
  var _time = new Date(),
      _timeResult = lib.checkDateFormat(_time.getHours()) + ':' + lib.checkDateFormat(_time.getMinutes()) + ':' + lib.checkDateFormat(_time.getSeconds());
  return _timeResult;
};

// 判断一个元素是否存在于某个数组中
lib.isElementInArray = function(_array, _element) {
  for(var _i = 0; _i < _array.length; _i++) {
    if(_element === _array[_i]) {
      return true;
    }
  }
  return false;
}

// 删除数组中的某个元素并返回一个新数组
lib.deleteElementInArray = function(_array, _element) {
  for(var _i = 0; _i < _array.length; _i++) {
    if(_element === _array[_i]) {
      return  _array.slice(0, _i).concat(_array.slice(_i + 1, _array.length));
    }
  }
}

// 使字符串的第一个字符大写
lib.upperFirst = function(_data) {
  return  _data.substring(0, 1).toUpperCase() + _data.substring(1);
}

module.exports = lib;
