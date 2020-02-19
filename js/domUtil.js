'use strict';

(function (w) {
  var ESC_KEY = 'Escape';
  var ENTER_KEY = 'Enter';
  var LEFT_BUTTON = 0;

  var Rect = function (left, top, right, bottom) {
    this.left = left;
    this.top = top;
    this.right = right;
    this.bottom = bottom;
  };

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

  var setCoordinateForStyleElement = function (element, x, y) {
    element.style.left = x + 'px';
    element.style.top = y + 'px';
  };

  var getCoordinateCenter = function (element) {
    return {
      x: getNumberCoordinateFromStyleElement(element.style.left, element.offsetWidth / 2),
      y: getNumberCoordinateFromStyleElement(element.style.top, element.offsetHeight / 2),
    };
  };

  var getNumberCoordinateFromStyleElement = function (coordinate, offset) {
    return Math.round(Number(coordinate.replace('px', '')) + ((offset !== undefined) ? offset : 0));
  };

  w.domUtil = {
    Rect: Rect,
    isEnterEvent: isEnterEvent,
    isEscEvent: isEscEvent,
    isLeftButtonMouseEvent: isLeftButtonMouseEvent,
    getCoordinateCenter: getCoordinateCenter,
    setCoordinateForStyleElement: setCoordinateForStyleElement,
    getNumberCoordinateFromStyleElement: getNumberCoordinateFromStyleElement
  };

})(window);
