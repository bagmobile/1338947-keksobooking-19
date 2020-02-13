'use strict';

(function () {

  var ESC_KEY = 'Escape';
  var ENTER_KEY = 'Enter';

  var map = document.querySelector('.map');
  var rentObjects = window.data.generateRentObjects();

  var initBooking = function () {
    deactivateBooking();
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

  window.pin.mapPinMain.addEventListener('mousedown', activateBookingHandler);

  window.pin.mapPinMain.addEventListener('keydown', activateBookingHandler);

  map.addEventListener('click', function (evt) {

    if ((evt.button === 0)) {
      if (evt.target.matches('article.map__card button.popup__close')) {
        window.card.closeRentCardElement(evt.target.parentElement);
      }
      if (evt.target.matches('.map__pin:not(.map__pin--main) > img')) {
        window.card.showRentCardElement(rentObjects, evt.target.parentElement);
      }
      if (evt.target.matches('.map__pin:not(.map__pin--main)')) {
        window.card.showRentCardElement(rentObjects, evt.target);
      }
    }
  });

  map.addEventListener('keydown', function (evt) {
    if (evt.key === ESC_KEY) {
      window.card.closeRentCardElement(map.querySelector('article.map__card:not(.hidden)'));
    }
    if ((evt.key === ENTER_KEY) && evt.target.matches('.map__pin:not(.map__pin--main)')) {
      window.card.showRentCardElement(rentObjects, evt.target);
    }
  });

  initBooking();

})();
