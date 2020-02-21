'use strict';

(function (w) {
  var MAP_INACTIVE_CLASS = 'map--faded';
  var map = document.querySelector('.map');

  var isActiveMap = function () {
    return !map.classList.contains(MAP_INACTIVE_CLASS);
  };

  var activate = function () {
    if (!isActiveMap()) {
      map.classList.remove(MAP_INACTIVE_CLASS);
    }
  };

  var deactivate = function () {
    map.classList.add(MAP_INACTIVE_CLASS);
  };

  map.addEventListener('keydown', function (evt) {
    /* window.domUtil.isEscEvent(evt, function () {
       window.card.closeRentCardElement(map.querySelector('article.map__card:not(.hidden)'));
     });*/

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
