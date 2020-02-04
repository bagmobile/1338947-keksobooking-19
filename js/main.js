'use strict';

var MAX_RENT_OBJECT = 8;
var LEFT_OFFSET = 25;

var generateAvatarName = function (i) {
  var TEMPLATE_REPLACEMENT = '{{xx}}';
  var avatarPattern = 'img/avatars/user{{xx}}.png';
  return avatarPattern.replace(TEMPLATE_REPLACEMENT, '0' + i);
};

var generateRangeRandomValue = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

var generateRentObjects = function () {
  var result = [];
  for (var i = 0; i < MAX_RENT_OBJECT; i++) {
    var mapElement = document.querySelector('.map__pins');
    result.push({
      'author': {
        'avatar': generateAvatarName(i + 1),
      },
      'offer': {
        'title': 'Offer' + (i + 1),
        'address': '',
        'price': '',
        'type': '',
        'rooms': '',
        'guests': '',
        'checkin': '',
        'checkout': '',
        'features': '',
        'description': '',
        'photos': '',
      },
      'location': {
        'x': generateRangeRandomValue(mapElement.clientLeft + LEFT_OFFSET, mapElement.clientLeft + mapElement.clientWidth - LEFT_OFFSET),
        'y': generateRangeRandomValue(130, 630),
      },
    });
  }
  return result;
};

var createRentObjectElement = function (rentObject) {
  var templateRentObject = document.querySelector('#pin').content;
  var rentObjectElement = templateRentObject.cloneNode(true);

  rentObjectElement.querySelector('.map__pin').style = 'left: ' + (rentObject.location.x - 25) + 'px; top:' + (rentObject.location.y - 70) + 'px';
  rentObjectElement.querySelector('img').src = rentObject.author.avatar;
  rentObjectElement.querySelector('img').alt = rentObject.offer.title;

  return rentObjectElement;
};

var renderRentObjects = function (rentObjects) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < rentObjects.length; i++) {
    var rentObjectElement = createRentObjectElement(rentObjects[i]);
    fragment.appendChild(rentObjectElement);
  }
  document.querySelector('.map__pins').appendChild(fragment);
};

document.querySelector('.map').classList.remove('map--faded');
var rentObjects = generateRentObjects();
renderRentObjects(rentObjects);


