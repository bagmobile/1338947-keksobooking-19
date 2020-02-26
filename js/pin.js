'use strict';

(function (w) {

  var PinRangeY = {
    MIN: 130,
    MAX: 630,
  };
  var PinOffset = {
    LEFT_OFFSET: 25,
    TOP_OFFSET: 70,
  };
  var MainPinOffset = {
    LEFT_OFFSET: 32.5,
    TOP_OFFSET: 84,
  };

  var map = document.querySelector('.map');
  var mainPin = document.querySelector('.map__pin--main');
  var pinBlock = document.querySelector('.map__pins');
  var templatePinElement = document.querySelector('#pin').content;
  var mapPinRect = new window.domUtil.Rect(-MainPinOffset.LEFT_OFFSET, PinRangeY.MIN, map.clientWidth - MainPinOffset.LEFT_OFFSET, PinRangeY.MAX);
  var initMainPinCoordinate = new window.domUtil.Coordinate().getFromStyle(mainPin);

  var getMainPinOffset = function () {
    return new window.domUtil.Coordinate(MainPinOffset.LEFT_OFFSET, MainPinOffset.TOP_OFFSET);
  };

  var setMainPinToCenterMap = function () {
    new window.domUtil.Coordinate(initMainPinCoordinate.x, initMainPinCoordinate.y).setToStyle(mainPin);
  };

  var getCoordinateMainPinCenter = function () {
    return new window.domUtil.Coordinate().getFromStyle(mainPin).setOffset(mainPin.offsetWidth / 2, mainPin.offsetHeight / 2);
  };

  var getCoordinateMainPinPoint = function () {
    return new window.domUtil.Coordinate().getFromStyle(mainPin).setOffset(MainPinOffset.LEFT_OFFSET, MainPinOffset.TOP_OFFSET);
  };

  var setActivePin = function (element) {
    element.classList.add('map__pin--active');
  };

  var setInactivePin = function (element) {
    var targetElement = element || map.querySelector('.map__pin--active');
    if (targetElement) {
      targetElement.classList.remove('map__pin--active');
    }
  };

  var showCard = function (evt, rentObject) {
    window.card.onShowCard(rentObject);
    setActivePin(evt.currentTarget);
  };

  var createPinElement = function (rentObject) {
    var pinElement = templatePinElement.cloneNode(true).querySelector('.map__pin');
    var location = rentObject.getLocation();
    pinElement.querySelector('img').src = rentObject.getAvatar();
    pinElement.querySelector('img').alt = rentObject.getTitle();
    new window.domUtil.Coordinate(location.x, location.y)
      .setOffset(-PinOffset.LEFT_OFFSET, -PinOffset.TOP_OFFSET)
      .setToStyle(pinElement);

    pinElement.addEventListener('click', function (evt) {
      window.domUtil.isLeftButtonMouseEvent(evt, function () {
        showCard(evt, rentObject);
      });
    });
    pinElement.addEventListener('keydown', function (evt) {
      window.domUtil.isEnterEvent(evt, function () {
        showCard(evt, rentObject);
      });
    });
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
    map.querySelectorAll('.map__pin:not(.map__pin--main)').forEach(function (element) {
      element.remove();
    });
  };

  mainPin.addEventListener('mousedown', function (mouseDownEvent) {
    var coordinate = new window.domUtil.Coordinate(mouseDownEvent.clientX, mouseDownEvent.clientY);

    var onMouseMove = function (mouseMoveEvent) {
      var shiftCoordinate = new window.domUtil.Coordinate(coordinate.x, coordinate.y).setOffset(-mouseMoveEvent.clientX, -mouseMoveEvent.clientY);
      var newCoordinate = new window.domUtil.Coordinate(mainPin.offsetLeft, mainPin.offsetTop).setOffset(-shiftCoordinate.x, -shiftCoordinate.y);

      if (newCoordinate.isInRect(mapPinRect)) {
        newCoordinate.setToStyle(mainPin);
        window.form.setAddress(newCoordinate.setOffset(MainPinOffset.LEFT_OFFSET, MainPinOffset.TOP_OFFSET));
        coordinate.set(mouseMoveEvent.clientX, mouseMoveEvent.clientY);
      }
    };

    var onMouseUp = function () {
      window.form.setAddress(new window.domUtil.Coordinate()
        .getFromStyle(mainPin)
        .setOffset(MainPinOffset.LEFT_OFFSET, MainPinOffset.TOP_OFFSET));
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  var onActivateMap = function () {
    var onSuccess = function (data) {
      if (data.length !== 0) {
        window.data.setDataRentObjects(data);
        if (!window.data.isVerifiedData()) {
          return;
        }
        renderPinElements(window.data.getFilteredRentObjects());
        window.form.activateFilterForm();
      }
      window.map.activate();
      window.form.activateNoticeForm();
    };
    var onError = function (error) {
      window.message.showErrorMessage(error);
    };
    if (!window.map.isActiveMap()) {
      window.ajax.loadData(null, onSuccess, onError);
    }
  };

  var onMouseDownMainPin = function (evt) {
    window.domUtil.isLeftButtonMouseEvent(evt, onActivateMap);
  };

  mainPin.addEventListener('mousedown', onMouseDownMainPin);

  w.pin = {
    setMainPinToCenterMap: setMainPinToCenterMap,
    getCoordinateMainPinCenter: getCoordinateMainPinCenter,
    getCoordinateMainPinPoint: getCoordinateMainPinPoint,
    getMainPinOffset: getMainPinOffset,
    renderPinElements: renderPinElements,
    removePinElements: removePinElements,
    setInactivePin: setInactivePin,
  };

})(window);
