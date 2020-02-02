'use strict';

var MAX_RENT_OBJECT = 8;

var generateAvatarName = function (i) {
  var TEMPLATE_REPLACEMENT = '{{xx}}';
  var avatarPattern = 'img/avatars/user{{xx}}.png';
  return avatarPattern.replace(TEMPLATE_REPLACEMENT, '0' + i);
};
var generateRentObjects = function () {
  var result = [];
  for (var i = 0; i < MAX_RENT_OBJECT; i++) {
    var x =
      result.push({
        'author': {
          'avatar': generateAvatarName(i + 1),
        },
        'offer': {
          'title': 'Offer',
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
          'x': 100,
          'y': 100,
        },
      });
  }
  return result;
};

var createRentObjectElement = function (rentObject) {
  var templateRentObject = document.querySelector('#pin')
    .content
    .querySelector('.map__pin');
  var rentObjectElement = templateRentObject.cloneNode(true);
  rentObjectElement.style = 'left: 130; right: 160;';
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

var rentObjects = generateRentObjects();
renderRentObjects(rentObjects);
document.querySelector('.map').classList.remove('map--faded');

//console.log(generateRentObjects());
