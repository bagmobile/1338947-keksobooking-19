'use strict';

(function (w) {
  var LEFT_OFFSET = 25;
  var TOP_OFFSET = 70;
  var mapPinMain = document.querySelector('.map__pin--main');
  var inserArea = document.querySelector('.map__pins');
  var templateRentObject = document.querySelector('#pin').content;

  var createRentPinElement = function (rentObject, order) {
    var rentObjectElement = templateRentObject.cloneNode(true);
    rentObjectElement.querySelector('.map__pin').style = 'left: ' + (rentObject.location.x - LEFT_OFFSET) + 'px; top:' + (rentObject.location.y - TOP_OFFSET) + 'px';
    rentObjectElement.querySelector('img').src = rentObject.author.avatar;
    rentObjectElement.querySelector('img').alt = rentObject.offer.title;
    rentObjectElement.querySelector('.map__pin').dataset.rentOrderElement = order;
    return rentObjectElement;
  };

  var renderRentPinElements = function (rentObjects) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < rentObjects.length; i++) {
      fragment.appendChild(createRentPinElement(rentObjects[i], i));
    }
    inserArea.appendChild(fragment);
  };


  w.pin = {
    LEFT_OFFSET: LEFT_OFFSET,
    TOP_OFFSET: TOP_OFFSET,
    mapPinMain: mapPinMain,
    renderRentPinElements: renderRentPinElements
  };
})(window);
