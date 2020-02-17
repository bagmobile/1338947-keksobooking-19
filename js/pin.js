'use strict';

(function (w) {
  var PinOffset = {
    LEFT_OFFSET: 25,
    TOP_OFFSET: 70,
  };
  var MainPinOffset = {
    LEFT_OFFSET: 32.5,
    TOP_OFFSET: 84,
  };
  var map = document.querySelector('.map');
  var mapAreaRange = {
    y: {begin: 130, end: 630},
    x: {begin: 0, end: map.clientWidth - MainPinOffset.LEFT_OFFSET * 2},
  };
  var mainPin = document.querySelector('.map__pin--main');
  var inserArea = document.querySelector('.map__pins');
  var templateRentObject = document.querySelector('#pin').content;

  var createRentPinElement = function (rentObject, order) {
    var rentObjectElement = templateRentObject.cloneNode(true);
    setCoordinateForStyleElement(rentObjectElement.querySelector('.map__pin'), rentObject.location.x - PinOffset.LEFT_OFFSET, rentObject.location.y - PinOffset.TOP_OFFSET);
    rentObjectElement.querySelector('img').src = rentObject.author.avatar;
    rentObjectElement.querySelector('img').alt = rentObject.offer.title;
    rentObjectElement.querySelector('.map__pin').dataset.rentOrderElement = order;
    return rentObjectElement;
  };

  var renderRentPinElements = function (rentObjects) {
    var fragment = document.createDocumentFragment();
    rentObjects.forEach(function (value, index) {
      fragment.appendChild(createRentPinElement(value, index));
    });
    inserArea.appendChild(fragment);
  };

  var getNumberCoordinateFromStyleElement = function (coordinate, offset) {
    return Math.round(Number(coordinate.replace('px', '')) + offset);
  };

  var setCoordinateForStyleElement = function (element, x, y) {
    element.style.left = x + 'px';
    element.style.top = y + 'px';
  };

  var getCoordinatePinCenter = function (element) {
    return {
      x: getNumberCoordinateFromStyleElement(element.style.left, element.offsetWidth / 2),
      y: getNumberCoordinateFromStyleElement(element.style.top, element.offsetHeight / 2),
    };
  };

  var getCoordinatePointMainPin = function () {
    return {
      x: getNumberCoordinateFromStyleElement(mainPin.style.left, MainPinOffset.LEFT_OFFSET),
      y: getNumberCoordinateFromStyleElement(mainPin.style.top, MainPinOffset.TOP_OFFSET),
    };
  };

  var isPinInRangeArea = function (element, shift) {
    return (mainPin.offsetTop - shift.y > mapAreaRange.y.begin)
      && (mainPin.offsetTop - shift.y < mapAreaRange.y.end)
      && (mainPin.offsetLeft + MainPinOffset.LEFT_OFFSET - shift.x > mapAreaRange.x.begin)
      && (mainPin.offsetLeft - MainPinOffset.LEFT_OFFSET - shift.x < mapAreaRange.x.end);
  };

  mainPin.addEventListener('mousedown', function (mouseDownEvent) {
    var startCoords = {
      x: mouseDownEvent.clientX,
      y: mouseDownEvent.clientY,
    };
    var removeListener = function () {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    var onMouseMove = function (mouseMoveEvent) {
      var shift = {
        x: startCoords.x - mouseMoveEvent.clientX,
        y: startCoords.y - mouseMoveEvent.clientY,
      };
      if (!isPinInRangeArea(mainPin, shift)) {
        removeListener();
        return;
      }
      startCoords = {
        x: mouseMoveEvent.clientX,
        y: mouseMoveEvent.clientY,
      };
      setCoordinateForStyleElement(mainPin, mainPin.offsetLeft - shift.x, mainPin.offsetTop - shift.y);
      window.form.setAddress(getCoordinatePointMainPin());
    };

    var onMouseUp = function () {
      window.form.setAddress(getCoordinatePointMainPin());
      removeListener();
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  w.pin = {
    mainPin: mainPin,
    getCoordinatePinCenter: getCoordinatePinCenter,
    getCoordinatePointMainPin: getCoordinatePointMainPin,
    renderRentPinElements: renderRentPinElements,
  };
})(window);
