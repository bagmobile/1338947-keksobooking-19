'use strict';

(function (w) {
  var ESC_KEY = 'Escape';
  var ENTER_KEY = 'Enter';
  var LEFT_BUTTON = 0;

  var isEscEvent = function (evt, onKeyDown) {
    if (evt.key === ESC_KEY) {
      onKeyDown();
    }
  };
  var isEnterEvent = function (evt, onKeyDown) {
    if (evt.key === ENTER_KEY) {
      onKeyDown();
    }
  };
  var isLeftButtonMouseEvent = function (evt, onClick) {
    if (evt.button === LEFT_BUTTON) {
      onClick();
    }
  };

  w.domUtil = {
    isEnterEvent: isEnterEvent,
    isEscEvent: isEscEvent,
    isLeftButtonMouseEvent: isLeftButtonMouseEvent
  };
})(window);
