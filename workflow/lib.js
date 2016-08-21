// 工具方法

var lib = {};

lib.checkDateFormat = function(_date) {
  if (_date < 10) {
    _date = '0' + _date; 
  }
  return _date; 
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

module.exports = lib;
