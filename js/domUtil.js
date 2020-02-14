'use strict';

(function (w) {
  var ESC_KEY = 'Escape';
  var ENTER_KEY = 'Enter';
  var LEFT_BUTTON = 0;

  var isEscEvent = function (evt, action) {
    if (evt.key === ESC_KEY) {
      action();
    }
  };
  var isEnterEvent = function (evt, action) {
    if (evt.key === ENTER_KEY) {
      action();
    }
  };
  var isLeftButtonMouseEvent = function (evt, action) {
    if (evt.button === LEFT_BUTTON) {
      action();
    }
  };

  w.domUtil = {
    isEnterEvent: isEnterEvent,
    isEscEvent: isEscEvent,
    isLeftButtonMouseEvent: isLeftButtonMouseEvent
  };
})(window);
