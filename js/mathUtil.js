'use strict';

(function (w) {
  var generateRandomValue = function (max) {
    return Math.floor(Math.random() * max);
  };

  var generateRangeRandomValue = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  var generateRandomArrayFromArray = function (arr) {
    var result = [];
    var beginIndex = generateRandomValue(arr.length);
    for (var i = beginIndex; i < arr.length; i++) {
      result.push(arr[i]);
    }
    return result;
  };

  w.mathUtil = {
    generateRandomValue: generateRandomValue,
    generateRangeRandomValue: generateRangeRandomValue,
    generateRandomArrayFromArray: generateRandomArrayFromArray
  };
})(window);
