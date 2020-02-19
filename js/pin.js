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
  var pinBlock = document.querySelector('.map__pins');
  var templateRentObject = document.querySelector('#pin').content;

  var initMainPinCoordinate = {
    x: window.domUtil.getNumberCoordinateFromStyleElement(mainPin.style.left),
    y: window.domUtil.getNumberCoordinateFromStyleElement(mainPin.style.top)
  };

  var resetActivePin = function (element) {
    var activePin = map.querySelector('.map__pin--active');
    if (activePin) {
      activePin.classList.remove('map__pin--active');
    }
    if (element) {
      element.classList.add('map__pin--active');
    }
  };

  var createPinElement = function (rentObject) {
    var pinElement = templateRentObject.cloneNode(true).querySelector('.map__pin');
    window.domUtil.setCoordinateForStyleElement(pinElement, rentObject.location.x - PinOffset.LEFT_OFFSET, rentObject.location.y - PinOffset.TOP_OFFSET);
    pinElement.querySelector('img').src = rentObject.author.avatar;
    pinElement.querySelector('img').alt = rentObject.offer.title;
    pinElement.dataset.rentOrderElement = rentObject.id;
    return pinElement;
  };

  var renderPinElements = function (rentObjects) {
    var fragment = document.createDocumentFragment();
    rentObjects.forEach(function (value) {
      fragment.appendChild(createPinElement(value));
    });
    pinBlock.appendChild(fragment);
  };

  var removePinElements = function () {
    window.map.map.querySelectorAll('.map__pin:not(.map__pin--main)').forEach(function (element) {
      element.remove();
    });
  };

  var getCoordinatePointMainPin = function () {
    return {
      x: window.domUtil.getNumberCoordinateFromStyleElement(mainPin.style.left, MainPinOffset.LEFT_OFFSET),
      y: window.domUtil.getNumberCoordinateFromStyleElement(mainPin.style.top, MainPinOffset.TOP_OFFSET),
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
      window.domUtil.setCoordinateForStyleElement(mainPin, mainPin.offsetLeft - shift.x, mainPin.offsetTop - shift.y);
      window.form.setAddress(getCoordinatePointMainPin());
    };

    var onMouseUp = function () {
      window.form.setAddress(getCoordinatePointMainPin());
      removeListener();
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  var onActivateMap = function () {
    var onSuccess = function (data) {
      window.map.activate();
      window.form.activateNoticeForm();
      if (data.length !== 0) {
        window.data.setDataRentObjects(data);
        renderPinElements(window.data.getFilteredRentObjects());
        window.form.activateFilterForm();
      }
    };
    var onError = function (error) {
      window.map.deactivate();
      window.message.showErrorMessage(error);
    };
    if (!window.map.isActiveMap()) {
      window.load.loadData(onSuccess, onError);
    }
  };


  var onMouseDownMainPin = function (evt) {
    window.domUtil.isLeftButtonMouseEvent(evt, onActivateMap);
  };

  var onKeyDownMainPin = function (evt) {
    window.domUtil.isEnterEvent(evt, onActivateMap);
  };

  mainPin.addEventListener('mousedown', onMouseDownMainPin);

  mainPin.addEventListener('keydown', onKeyDownMainPin);

  w.pin = {
    mainPin: mainPin,
    initMainPinCoordinate: initMainPinCoordinate,
    getCoordinatePointMainPin: getCoordinatePointMainPin,
    renderPinElements: renderPinElements,
    removePinElements: removePinElements,
    resetActivePin: resetActivePin
  };
})(window);
