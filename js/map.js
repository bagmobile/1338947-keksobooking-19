'use strict';

(function () {

  var rentObjects;
  var map = document.querySelector('.map');

  var initMap = function () {
    var onSuccess = function (data) {
      rentObjects = data;
      window.pin.mainPin.addEventListener('mousedown', function (evt) {
        window.domUtil.isLeftButtonMouseEvent(evt, onActivateMap);
      });
      window.pin.mainPin.addEventListener('keydown', function (evt) {
        window.domUtil.isEnterEvent(evt, onActivateMap);
      });
    };
    var onError = function (error) {
      window.message.showErrorMessage('Обновите страницу. ' + error);
    };
    deactivateMap();
    window.load.loadData(onSuccess, onError);
  };

  var onActivateMap = function () {
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
