'use strict';

(function (w) {
  var ESC_KEY = 'Escape';
  var ENTER_KEY = 'Enter';
  var SPACE_KEY = ' ';
  var LEFT_BUTTON = 0;


  var Coordinate = function (x, y) {
    this.x = x;
    this.y = y;
    this.set = function (newX, newY) {
      this.x = newX;
      this.y = newY;
    };
    this.getFromStyle = function (element) {
      this.x = Number(element.style.left.replace('px', ''));
      this.y = Number(element.style.top.replace('px', ''));
      return this;
    };
    this.setToStyle = function (element) {
      element.style.left = this.x + 'px';
      element.style.top = this.y + 'px';
    };
    this.setOffset = function (offsetX, offsetY) {
      this.x = Math.round(this.x + offsetX);
      this.y = Math.round(this.y + offsetY);
      return this;
    };
    this.isInRect = function (rect) {
      return (this.y > rect.top) && (this.y < rect.bottom) && (this.x > rect.left) && (this.x < rect.right);
    };
  };

  var Rect = function (left, top, right, bottom) {
    this.left = left;
    this.top = top;
    this.right = right;
    this.bottom = bottom;
  };

  var isEscEvent = function (evt, onKeyDown) {
    if (evt.key === ESC_KEY) {
      onKeyDown(evt);
    }
  };
  var isEnterEvent = function (evt, onKeyDown) {
    if (evt.key === ENTER_KEY) {
      onKeyDown(evt);
    }
  };
  var isSpaceEvent = function (evt, onKeyDown) {
    if (evt.key === SPACE_KEY) {
      onKeyDown(evt);
    }
  };
  var isLeftButtonMouseEvent = function (evt, onClick) {
    if (evt.button === LEFT_BUTTON) {
      onClick(evt);
    }
  };

  var setFocusOnBlock = function (element) {
    element.setAttribute('tabIndex', 0);
    element.focus();
  };

  var hideEmptyElement = function (element) {
    if (element) {
      element.classList.add('hidden');
    }
  };

  var setAttribute = function (element, attribute, value) {
    if (element && value) {
      element.setAttribute(attribute, value);
    } else {
      hideEmptyElement(element);
    }
  };

  var setTextContent = function (element, value) {
    if (element && value) {
      element.textContent = value;
    } else {
      hideEmptyElement(element);
    }
  };


  w.domUtil = {
    Coordinate: Coordinate,
    Rect: Rect,
    isEnterEvent: isEnterEvent,
    isEscEvent: isEscEvent,
    isSpaceEvent: isSpaceEvent,
    isLeftButtonMouseEvent: isLeftButtonMouseEvent,
    setFocusOnBlock: setFocusOnBlock,
    hideEmptyElement: hideEmptyElement,
    setAttribute: setAttribute,
    setTextContent: setTextContent,
  };

})(window);
