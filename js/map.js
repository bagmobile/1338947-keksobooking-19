'use strict';

(function () {

  var rentObjects;
  var map = document.querySelector('.map');

  var initMap = function () {
    var onSuccess = function (data) {
      rentObjects = data;
      window.pin.mapPinMain.addEventListener('mousedown', onActivateMap);
      window.pin.mapPinMain.addEventListener('keydown', onActivateMap);
    };
    var onError = function (error) {
      window.message.showErrorMessage('Обновите страницу. ' + error);
    };
    deactivateMap();
    window.load.loadData(onSuccess, onError);
  };

  var activateMap = function () {
    if (map.classList.contains('map--faded')) {
      map.classList.remove('map--faded');
      window.pin.renderRentPinElements(rentObjects);
      window.form.activate();
    }
  };

  var deactivateMap = function () {
    window.form.deactivate();
    map.classList.add('map--faded');
  };

  var onActivateMap = function (evt) {
    window.domUtil.isEnterEvent(evt, activateMap);
    window.domUtil.isLeftButtonMouseEvent(evt, activateMap);
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

  initMap();

})();
