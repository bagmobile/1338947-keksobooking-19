'use strict';

(function (w) {

  var map = document.querySelector('.map');

  var activate = function () {
    if (!isActiveMap()) {
      map.classList.remove('map--faded');
    }
  };

  var deactivate = function () {
    map.classList.add('map--faded');
  };

  var isActiveMap = function () {
    return !map.classList.contains('map--faded');
  };

  map.addEventListener('click', function (evt) {
    window.domUtil.isLeftButtonMouseEvent(evt, function () {
      if (evt.target.matches('article.map__card button.popup__close')) {
        window.card.closeRentCardElement(evt.target.parentElement);
      }
    });

    window.domUtil.isLeftButtonMouseEvent(evt, function () {
      window.card.showRentCardElement(evt.target);
    });

  });

  map.addEventListener('keydown', function (evt) {
    window.domUtil.isEscEvent(evt, function () {
      window.card.closeRentCardElement(map.querySelector('article.map__card:not(.hidden)'));
    });

    window.domUtil.isEnterEvent(evt, function () {
      window.card.showRentCardElement(evt.target);
    });
  });

  w.map = {
    map: map,
    isActiveMap: isActiveMap,
    activate: activate,
    deactivate: deactivate
  };

})(window);
