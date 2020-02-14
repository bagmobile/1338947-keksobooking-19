'use strict';

(function () {

  var rentObjects;
  var map = document.querySelector('.map');

  var initBooking = function () {
    var successHandler = function (data) {
      rentObjects = data;
      window.pin.mapPinMain.addEventListener('mousedown', activateBookingHandler);
      window.pin.mapPinMain.addEventListener('keydown', activateBookingHandler);
    };
    var errorHandler = function (error) {
      addErrorMessageElement(error);
    };
    window.load.loadData(successHandler, errorHandler);
    deactivateBooking();
  };

  var addErrorMessageElement = function (error) {
    var node = document.createElement('div');
    node.style = 'z-index: 100; margin: 100px auto; text-align: center; color: red;';
    node.style.position = 'absolute';
    node.style.left = 0;
    node.style.right = 0;
    node.style.fontSize = '30px';
    node.textContent = error;
    map.append(node);
  };

  var activateBooking = function () {
    if (document.querySelector('.map.map--faded') !== null) {
      map.classList.remove('map--faded');
      window.pin.renderRentPinElements(rentObjects);
      window.form.activate();
    }
  };

  var deactivateBooking = function () {
    window.form.deactivate();
    map.classList.add('map--faded');
  };

  var activateBookingHandler = function (evt) {
    window.domUtil.isEnterEvent(evt, activateBooking);
    window.domUtil.isLeftButtonMouseEvent(evt, activateBooking);
  };

  map.addEventListener('click', function (evt) {

    window.domUtil.isLeftButtonMouseEvent(evt, function () {
      if (evt.target.matches('article.map__card button.popup__close')) {
        window.card.closeRentCardElement(evt.target.parentElement);
      }
    });

    window.domUtil.isLeftButtonMouseEvent(evt, function () {
      window.card.showRentCardElement(rentObjects, evt.target);
    });

  });

  map.addEventListener('keydown', function (evt) {

    window.domUtil.isEscEvent(evt, function () {
      window.card.closeRentCardElement(map.querySelector('article.map__card:not(.hidden)'));
    });

    window.domUtil.isEnterEvent(evt, function () {
      window.card.showRentCardElement(rentObjects, evt.target);
    });
  });

  initBooking();

})();
